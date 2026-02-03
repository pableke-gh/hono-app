
import Validators from "../../i18n/validators.js";
import form from "../modules/solicitud.js";

class XecoValidators extends Validators {
	success(data) { form.closeAlerts(); this.reset(); return data; } // Succesful validations
	fail(msg) { form.setErrors(super.fail(msg)); return !this.reset(); } // force error for validation

	firma() {
		const data = form.getData(); // start validation
		const msg = "Debe indicar un motivo para el rechazo de la solicitud.";
		return this.size500("rechazo", data.rechazo, msg).close(data); // Required string
	}
}

export default new XecoValidators();
