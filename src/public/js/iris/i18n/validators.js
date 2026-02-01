
import Validators from "../../i18n/validators.js";
import form from "../../xeco/modules/SolicitudForm.js";

class IrisValidators extends Validators {
	start(selector) { this.reset(); return form.closeAlerts().getData(selector); } // Reset previous messages and get current form data
	close = (data, msg) => this.isOk() ? data : !form.setErrors(this.error(msg)); // Set form errors if not valid

}

export default new IrisValidators();
