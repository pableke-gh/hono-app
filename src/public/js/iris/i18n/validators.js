
import coll from "../../components/CollectionHTML.js";
import dt from "../../components/types/DateBox.js";
import sb from "../../components/types/StringBox.js";
import Validators from "../../core/i18n/validators.js";

import ruta from "../model/ruta/Ruta.js";
import rutas from "../model/ruta/Rutas.js";
import gastos from "../model/gasto/Gastos.js";

import perfil from "../modules/perfil/perfil.js";
import organicas from "../modules/perfil/organicas.js";
import actividad from "../modules/perfil/actividad.js";
import form from "../modules/iris.js";

const MIN_DATE = dt.addYears(new Date(), -1); //tb.now().add({ years: -1 }); //1 año antes
const MAX_DATE = dt.addDays(new Date(), 180); //tb.now().add({ days: 180 }); //6 meses despues 

class IrisValidators extends Validators {
	success(data) { form.closeAlerts(); this.reset(); return data; } // Succesful validations
	fail(msg) { form.setErrors(super.fail(msg)); return !this.reset(); } // force error for validation
	rechazar() { return super.rechazar(form.getData()); } // specific implementation

	perfil() {
		const data = form.getData(); // start validation
		if (actividad.isEmpty() || !data.actividad)
        	this.addRequired("acInteresado", "errPerfil");
		if (organicas.isEmpty())
			this.addRequired("acOrganica", "errOrganicas");
		return this.close(data);
    }

	mun() {
		const data = form.getData(); // start validation
		if (!data.memo) // valida textarea
        	this.addRequired("memo", "errObjeto");
		if (!actividad.isMun())
			return this.close(data);
		const rutaMun = form.getData(".ui-mun");
		this.size("origen", rutaMun.origen, "errOrigen").isDate("dt1", rutaMun.dt1); //ha seleccionado un origen
		if (ruta.isVehiculoPropio(rutaMun)) { // vehiculo propio
			const msg = "Debe indicar el kilometraje del desplazamiento";
			this.size20("matricula", rutaMun.matricula, "errMatricula").gt0("km1", rutaMun.km1, msg);
		}
		if (this.isError()) // valido mun
			return this.fail(); // error en mun
		rutaMun.destino = rutaMun.origen;
		rutaMun.pais1 = rutaMun.pais2 = "ES";
		rutaMun.dt1 = sb.toIsoDate(rutaMun.dt1);
		rutaMun.dt2 = sb.endDay(rutaMun.dt1);
		rutaMun.km2 = rutaMun.km1; // km1 = km2
		rutaMun.mask = 5; // es cartagena + principal
		if (!this.ruta(rutaMun)) // valido el formulario mun
			return this.fail(); // error => no hago nada
		data.rutas = [ rutaMun ]; // actualizo las rutas
		const resumen = { size: 1, totKm: rutaMun.km1 };
		resumen.impKm = (rutaMun.km1 * ruta.getImpGasolina());
		resumen.vp = +ruta.isVehiculoPropio(rutaMun);
		data.gastos = gastos.setPaso1(rutaMun, resumen).getGastos(); // actualizo los gastos 
		rutas.setRutas(data.rutas); // validation = true
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
	itinerario() { // validaciones para los mapas
		const data = form.getData(); // start validation
		if (perfil.isMaps() && (rutas.size() < 2)) // min rutas = 2
			return this.addRequired("destino", "errMinRutas").fail("errItinerario");
		return this.rutas(rutas.getRutas()) && data;
	}
	/** validaciones del paso 2 **/

	paso9() {
		const data = form.getData();  // start validation
		this.size50("iban", data.iban, "errIban");
		if (!data.cuentas) {
			if (data.paises == "ES")
				this.size("codigoEntidad", data.codigoEntidad, "errEntidad", 4);
			else
				this.size("swift", data.swift, "errSwift").size("nombreEntidad", data.nombreEntidad);
		}
		if (data.urgente == "2") { // Solicitud urgente
			this.size("extra", data.extra, "Debe indicar un motivo para la urgencia de esta solicitud."); // Required string
			this.geToday("fMax", data.fMax, "Debe indicar una fecha maxima de resolución para esta solicitud."); // Required date
		}
		return this.close(data);
	}
}

export default new IrisValidators();
