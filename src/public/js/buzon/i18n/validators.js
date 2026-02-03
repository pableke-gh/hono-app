
import Validators from "../../i18n/validators.js";
import form from "../../xeco/modules/solicitud.js";

class BuzonValidators extends Validators {
	success(data) { form.closeAlerts(); this.reset(); return data; } // Succesful validations
	fail(msg) { form.setErrors(super.fail(msg)); return !this.reset(); } // force error for validation

	tab5() {
		const data = form.getData(); // start validation
		const msgs = "Debe detallar las observaciones para el gestor.";
		return this.size500("desc", data.desc, msgs).close(data);
	}
}

export default new BuzonValidators();
