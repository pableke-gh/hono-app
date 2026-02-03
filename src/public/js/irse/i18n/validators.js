
import coll from "../../components/CollectionHTML.js";
import dt from "../../components/types/DateBox.js";
import Validators from "../../i18n/validators.js";

import ruta from "../model/Ruta.js";
import perfil from "../modules/perfil.js";
import form from "../../xeco/modules/solicitud.js";

const MIN_DATE = dt.addYears(new Date(), -1); //tb.now().add({ years: -1 }); //1 año antes
const MAX_DATE = dt.addDays(new Date(), 180); //tb.now().add({ days: 180 }); //6 meses despues 

class IrseValidators extends Validators {
	success(data) { form.closeAlerts(); this.reset(); return data; } // Succesful validations
	fail(msg) { form.setErrors(super.fail(msg)); return !this.reset(); } // force error for validation

	perfil() {
		const data = form.getData(); // start validation
		perfil.isEmpty() && this.addRequired("organica", "errOrganicas");
		return this.size20("interesado", data["nif-interesado"], "errPerfil").close(data);
	}

	/** validaciones del paso 2 **/
	ruta(data) {
		if (!data.origen || !data.pais1)
			this.addRequired("origen", "errOrigen");
		if (!dt.between(ruta.salida(data), MIN_DATE, MAX_DATE)) 
			return !this.addError("f1", "errFechasRuta");
		if (data.dt1 > data.dt2)
			this.addError("f1", "errFechasOrden");
		return this.isOk();
	}
	isRutasConsecutivas(r1, r2) {
		if (!this.ruta(r2))
			return false; //stop
		if (!r1.pais2.startsWith(r2.pais1.substring(0, 2)))
			return !this.addError("destino", "errItinerarioPaises");
		if (r1.dt2 > r2.dt1) //rutas ordenadas
			this.addError("destino", "errItinerarioFechas");
		return this.isOk();
	}
	rutas(rutas) {
		if (coll.isEmpty(rutas))
			return !this.addError("origen", "errItinerario");
		let r1 = rutas[0];
		if (!this.ruta(r1))
			return false; // salida erronea
		const origen = ruta.getOrigen(r1);
		for (let i = 1; i < rutas.length; i++) {
			const r2 = rutas[i];
			if (!this.isRutasConsecutivas(r1, r2))
				return false; //stop
			if (origen == r2.origen)
				return !this.addError("destino", "errMulticomision");
			r1 = r2; //go next route
		}
		return this.isOk();
	}
	itinerario(rutas) { // validaciones para los mapas
		const data = form.getData(); // start validation
		if (perfil.isMaps() && (coll.size(rutas) < 2)) // min rutas = 2
			return this.addRequired("destino", "errMinRutas").fail("errItinerario");
		return this.rutas(rutas) ? data : this.fail("errItinerario");
	}
	/** validaciones del paso 2 **/

	paso6(resume) {
		const data = form.getData();
		resume.justifi && this.size500("justifiKm", data.justifiKm, "errJustifiKm");
		return this.close(data);
	}
}

export default new IrseValidators();
