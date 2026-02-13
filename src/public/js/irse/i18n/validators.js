
import coll from "../../components/CollectionHTML.js";
import dt from "../../components/types/DateBox.js";
import sb from "../../components/types/StringBox.js";
import tabs from "../../components/Tabs.js";
import Validators from "../../core/i18n/validators.js";

import ruta from "../model/Ruta.js";
import gasto from "../model/Gasto.js";

import perfil from "../modules/perfil.js";
import rutas from "../modules/rutas.js";
import form from "../modules/irse.js";

const MIN_DATE = dt.addYears(new Date(), -1); //tb.now().add({ years: -1 }); //1 año antes
const MAX_DATE = dt.addDays(new Date(), 180); //tb.now().add({ days: 180 }); //6 meses despues 

class IrseValidators extends Validators {
	success(data) { form.closeAlerts(); this.reset(); return data; } // Succesful validations
	fail(msg) { form.setErrors(super.fail(msg)); return !this.reset(); } // force error for validation
	rechazar() { return super.rechazar(form.getData()); } // specific implementation

	perfil() {
		const data = form.getData(); // start validation
		perfil.isEmpty() && this.addRequired("organica", "errOrganicas");
		return this.size20("interesado", data["nif-interesado"], "errPerfil").close(data);
	}

	paso1() {
		const data = form.getData(); // start validation
		if (!data.objeto) // valida textarea
        	this.addRequired("objeto", "errObjeto");
		if (!perfil.isMun())
			return this.close(data);
		const rutaMun = form.getData(".ui-mun");
		this.size("origen", rutaMun.origen, "errOrigen").isDate("f1", rutaMun.f1); //ha seleccionado un origen
		if (ruta.isVehiculoPropio(rutaMun)) { // vehiculo propio
			const msg = "Debe indicar el kilometraje del desplazamiento";
			this.size20("matricula", rutaMun.matricula, "errMatricula").gt0("km1", rutaMun.km1, msg);
		}
		if (this.isError()) // valido mun
			return this.fail(); // error en mun
		rutaMun.destino = rutaMun.origen;
		rutaMun.pais1 = rutaMun.pais2 = "ES";
		rutaMun.dt1 = sb.toIsoDate(rutaMun.f1);
		rutaMun.dt2 = sb.endDay(rutaMun.dt1);
		rutaMun.km2 = rutaMun.km1; // km1 = km2
		rutaMun.mask = 5; // es cartagena + principal
		if (!this.ruta(rutaMun))
			return this.fail(); // valido la ruta mun
		// ruta por defecto para MUN = VP, principal  y ES
		rutas.setRuta(rutaMun); // actualizo las rutas
		return this.close(data);
	}

	/** validaciones del paso 2 **/
	addRuta = () => {
		const data = form.getData(".ui-ruta"); // start validation
		this.isDate("f2", data.f2).isTimeShort("h2", data.h2)
			.isDate("f1", data.f1).isTimeShort("h1", data.h1).le10("desp", data.desp)
			.size("destino", data.destino).size("origen", data.origen);
		if (ruta.isVehiculoPropio(data) && !data.matricula) // vehiculo propio sin matricula
			this.addRequired("matricula", "errMatricula");
		return this.close(data);
	}
	ruta(data) {
		if (!data.origen || !data.pais1)
			this.addRequired("origen", "errOrigen");
		//if (ruta.isVehiculoPropio(data) && !form.getValueByName("matricula"))
			//this.addRequired("matricula", "errMatricula");
		if (!dt.between(ruta.salida(data), MIN_DATE, MAX_DATE)) 
			this.addRequired("f1", "errFechasRuta");
		if (data.dt1 > data.dt2)
			this.addRequired("f1", "errFechasOrden");
		return this.close(data);
	}
	isRutasConsecutivas(r1, r2) {
		if (!this.ruta(r2))
			return false; //stop
		if (!r1.pais2.startsWith(r2.pais1.substring(0, 2)))
			return this.addRequired("destino", "errItinerarioPaises").fail();
		if (r1.dt2 > r2.dt1) //rutas ordenadas
			this.addError("destino", "notValid", "errItinerarioFechas");
		return this.close(r1);
	}

	rutas(rutas) {
		if (coll.isEmpty(rutas))
			return this.addError("origen", "notValid", "errItinerario").fail();
		let r1 = rutas[0];
		if (!this.ruta(r1))
			return false; // salida erronea
		const origen = ruta.getOrigen(r1);
		for (let i = 1; i < rutas.length; i++) {
			const r2 = rutas[i];
			if (!this.isRutasConsecutivas(r1, r2))
				return false; //stop
			if (origen == r2.origen)
				return this.addError("destino", "notValid", "errMulticomision").fail();
			r1 = r2; //go next route
		}
		return this.success(rutas);
	}
	itinerario(rutas) { // validaciones para los mapas
		const data = form.getData(); // start validation
		if (perfil.isMaps() && (coll.size(rutas) < 2)) // min rutas = 2
			return this.addRequired("destino", "errMinRutas").fail("errItinerario");
		return this.rutas(rutas) && data;
	}
	/** validaciones del paso 2 **/

	upload() {
		const data = form.getData();
		if (gasto.isTipoDoc(data.tipoGasto))
			return this.size250("txtGasto", data.txtGasto, "errDoc").close(data);
		if (this.gt0("impGasto", data.impGasto, "errGt0").isError())
			return this.fail(); // required inputs error
		if (gasto.isTipoTaxi(data.tipoGasto)) //ISU y taxi
			return this.size250("txtGasto", data.txtGasto).close(data);
		if (gasto.isTipoExtra(data.tipoGasto))
			return this.size250("txtGasto", data.txtGasto, "errJustifiExtra").close(data);
		if ((data.tipoGasto == "8") && !data.trayectos)
			return !tabs.showTab(12); //factura sin trayectos asociados => tab-12
		if (gasto.isTipoPernocta(data.tipoGasto) && (!data.fAloMin || !data.fAloMax))
			return this.addRequired("fAloMin", "errFechasAloja").fail();
		return this.success(data);
	}

	paso6(resume) {
		const data = form.getData();
		resume.justifi && this.size500("justifiKm", data.justifiKm, "errJustifiKm");
		return this.close(data);
	}

	paso9() {
		const data = form.getData();
		this.size50("iban", data.iban, "errIban");
		if (!data.cuentas) {
			if (data.paises != "ES")
				this.size20("swift", data.swift, "errSwift").size50("banco", data.banco, "errRequired");
			else
				this.size20("entidades", data.entidades);
		}
		if (data.urgente == "2")
			this.size500("extra", data.extra, "errExtra").geToday("fMax", data.fMax, "errFechaMax");
		return this.close(data);
	}
}

export default new IrseValidators();
