
import Validators from "../../i18n/validators.js";
import form from "../../xeco/modules/SolicitudForm.js";

class BuzonValidators extends Validators {
	start(selector) { this.reset(); return form.closeAlerts().getData(selector); } // Reset previous messages and get current form data
	close = (data, msg) => this.isOk() ? data : !form.setErrors(this.error(msg)); // Set form errors if not valid

	tab5() {
		const data = this.start(); // init. validation
		const msgs = "Debe detallar las observaciones para el gestor.";
		return this.size("desc", data.desc, msgs).close(data);
	}
}

export default new BuzonValidators();
