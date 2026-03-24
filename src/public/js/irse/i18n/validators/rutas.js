
import dt from "../../../components/types/DateBox.js";
import Validators from "../../../core/i18n/validators.js";

import ruta from "../../model/Ruta.js";
import rutas from "../../model/Rutas.js";
import form from "../../modules/irse.js";

const MIN_DATE = dt.addYears(new Date(), -1); //tb.now().add({ years: -1 }); //1 año antes
const MAX_DATE = dt.addDays(new Date(), 180); //tb.now().add({ days: 180 }); //6 meses despues 

// validaciones del paso 2
class RutasValidators extends Validators {
	success(data) { form.closeAlerts(); this.reset(); return data; } // Succesful validations
	fail(msg) { form.setErrors(super.fail(msg)); return !this.reset(); } // force error for validation
	rechazar() { return super.rechazar(form.getData()); } // specific implementation

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
}

export default new RutasValidators();
