
import Validators from "../../i18n/validators.js";
import form from "../modules/SolicitudForm.js";

class XecoValidators extends Validators {
	start(selector) { this.reset(); return form.closeAlerts().getData(selector); } // Reset previous messages and get current form data
	close = (data, msg) => this.isOk() ? data : !form.setErrors(this.error(msg)); // Set form errors if not valid

	firma() {
		const data = this.start(); // init. validation
		const msg = "Debe indicar un motivo para el rechazo de la solicitud.";
		return this.size("rechazo", data.rechazo, msg).close(data); // Required string
	}
}

export default new XecoValidators();
