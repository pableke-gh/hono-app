
import Validators from "../../i18n/validators.js";

class BuzonValidators extends Validators {
	#form = document.forms["facturas"];

	success(data) { this.#form.closeAlerts(); this.reset(); return data; } // Succesful validations
	fail(msg) { this.#form.setErrors(super.fail(msg)); return !this.reset(); } // force error for validation

	tab5() {
		const data = this.#form.getData(); // start validation
		const msgs = "Debe detallar las observaciones para el gestor.";
		return this.size500("desc", data.desc, msgs).close(data);
	}
}

export default new BuzonValidators();
