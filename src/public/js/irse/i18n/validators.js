
import Validators from "../../i18n/validators.js";
import perfil from "../modules/perfil.js";
import form from "../../xeco/modules/SolicitudForm.js";

class IrseValidators extends Validators {
	start(selector) { this.reset(); return form.closeAlerts().getData(selector); } // Reset previous messages and get current form data
	close = (data, msg) => this.isOk() ? data : !form.setErrors(this.error(msg)); // Set form errors if not valid

	perfil() {
		const data = this.start(); // init. validation
		perfil.isEmpty() && this.addRequired("organica", "errOrganicas");
		return this.isKey("interesado", data.interesado, "errPerfil").close(data);
	}

	ruta() {
		const ruta = this.start(); // init. validation
		this.size500("origen", ruta.origen, "errOrigen");
		if (ruta.desp == 1)
			this.size20("matricula", ruta.matricula, "errMatricula");
		if (!dt.inRange(new Date(ruta.dt1), MIN_DATE, MAX_DATE))
			return dom.addError("#f1", "errFechasRuta").isOk();
		if (ruta.dt1 > ruta.dt2)
			return dom.addError("#f1", "errFechasOrden").isOk();
		return dom.isOk();
	}
	rutas(r1, r2) {
		if (!self.valid(r2))
			return false; //stop
		if (!r1.pais2.startsWith(r2.pais1.substring(0, 2)))
			return dom.addError("#destino", "errItinerarioPaises").isOk();
		if (r1.dt2 > r2.dt1) //rutas ordenadas
			dom.addError("#destino", "errItinerarioFechas");
		return dom.isOk();
	}
}

export default new IrseValidators();
