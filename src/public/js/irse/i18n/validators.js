
import dt from "../../components/types/DateBox.js";
import tabs from "../../components/Tabs.js";
import Validators from "../../core/i18n/validators.js";

import ruta from "../model/Ruta.js";
import rutas from "../model/Rutas.js";
import gasto from "../model/Gasto.js";
import form from "../modules/irse.js";

const MIN_DATE = dt.addYears(new Date(), -1); //tb.now().add({ years: -1 }); //1 año antes
const MAX_DATE = dt.addDays(new Date(), 180); //tb.now().add({ days: 180 }); //6 meses despues 

class IrseValidators extends Validators {
	success(data) { form.closeAlerts(); this.reset(); return data; } // Succesful validations
	fail(msg) { form.setErrors(super.fail(msg)); return !this.reset(); } // force error for validation
	rechazar() { return super.rechazar(form.getData()); } // specific implementation

	perfil() {
		const ok = form.getElement("organica").validate();
		return form.getElement("interesado").validate() && ok;
	}

	paso1() {
		const data = form.getData(); // start validation
		if (!data.objeto) // valida textarea
        	this.addRequired("objeto", "errObjeto");
		if (!form.getPerfil().isMun())
			return this.close(data);
		const rutaMun = form.getData(".ui-mun");
		this.size("origen", rutaMun.origen, "errOrigen").isDate("f1", rutaMun.f1); //ha seleccionado un origen
		if (ruta.isVehiculoPropio(rutaMun)) { // vehiculo propio
			const msg = "Debe indicar el kilometraje del desplazamiento";
			this.size20("matriculaMun", rutaMun.matriculaMun, "errMatricula").gt0("km1", rutaMun.km1, msg);
		}
		if (this.isError()) // valido mun
			return this.fail(); // error en mun
		rutaMun.destino = rutaMun.origen;
		rutaMun.pais1 = rutaMun.pais2 = "ES";
		rutaMun.dt1 = rutaMun.dt2 = rutaMun.f1; // fecha llegada = fecha salida
		rutaMun.km2 = rutaMun.km1; // km1 = km2
		rutaMun.mask = 5; // es cartagena + principal
		if (!this.ruta(rutaMun))
			return this.fail(); // valido la ruta mun
		// ruta por defecto para MUN = VP, principal  y ES
		rutas.setRuta(rutaMun); // actualizo las rutas
		return this.success(rutaMun);
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

	rutas() {
		if (rutas.isEmpty())
			return this.addError("origen", "notValid", "errItinerario").fail();
		let r1 = rutas.get(0);
		if (!this.ruta(r1))
			return false; // salida erronea
		const origen = ruta.getOrigen(r1);
		for (let i = 1; i < rutas.size(); i++) {
			const r2 = rutas.get(i);
			if (!this.isRutasConsecutivas(r1, r2))
				return false; //stop
			if (origen == r2.origen)
				return this.addError("destino", "notValid", "errMulticomision").fail();
			r1 = r2; //go next route
		}
		return this.success(rutas.getRutas());
	}
	itinerario() { // validaciones para los mapas
		const data = form.getData(); // start validation
		if (form.getPerfil().isMaps() && (rutas.size() < 2)) // min rutas = 2
			return this.addRequired("destino", "errMinRutas").fail("errItinerario");
		return this.rutas() && data;
	}
	/** validaciones del paso 2 **/

	/** validaciones ISU **/
	congreso(f1, f2) {
		const fIniCong = dt.trunc(dt.addDays(dt.toDate(f1), -1)); // fecha inicio del congreso
		const fFinCong = dt.trunc(dt.addDays(dt.toDate(f2), 2)); // fecha fin del congreso
		return ((fIniCong && dt.lt(rutas.salida(), fIniCong)) || (fFinCong && dt.lt(fFinCong, rutas.llegada())));
	}
	paso3() {
		const data = form.getData(); // start validation
		this.size500("justifi", data.justifi, "errJustifiSubv");
		if (rutas.getNumRutasVp())
			this.size500("justifiVp", data.justifiVp, "errJustifiVp");
		if (data.congreso == "0") // no es congreso
			return this.close(data);
		if (this.congreso(data.fIniCong, data.fFinCong)) // valido los datos del congreso
			this.size500("justifiCong", data.justifiCong, "errCongreso");
		if (data.congreso == "4")
			this.gt0("impInsc", data.impInsc);
		return this.close(data);
	}
	/** validaciones ISU **/

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
		if (gasto.isTipoInterurbano(data.tipoGasto))
			return !tabs.showTab(12); //factura sin trayectos asociados => tab-12
		if (gasto.isTipoPernocta(data.tipoGasto) && (!data.fAloMin || !data.fAloMax))
			return this.addRequired("fAloMin", "errFechasAloja").fail();
		return this.success(data);
	}

	pernoctas() {
		const data = form.getData();
		this.gt0("impGasto", data.impGasto).isDate("fAloMin", data.fAloMin).isDate("fAloMax", data.fAloMax);
		if (data.fAloMin > data.fAloMax)
			return this.addRequired("fAloMin", "errFechasAloja").fail(); // stop validations

		const f1 = new Date(data.fAloMin); // T00:00:00.000Z
		const f2 = new Date(data.fAloMax); // T00:00:00.000Z
		data.num = dt.diffDays(f2, f1); // número de noches (fechas truncadas)

		const tipo = form.getOrganicas().getTipoDieta();
		const grupo = form.getPaso1().getGrupoDieta();
		const idPais1 = rutas.getPaisPernocta(f1);
		while (dt.lt(f1, f2)) { // range date iterator
			if (rutas.getPaisPernocta(f1) != idPais1)
				return this.addRequired("fMinGasto", "errPais").fail();
			f1.addDays(1); // incremento un día
		}
		data.imp2 = this.getImpNoche(tipo, idPais1, grupo);
		data.desc = i18n.getRegion(idPais1);
		return this.close(data);
	}

	resumen(resume) {
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
