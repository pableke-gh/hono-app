
import Validators from "../../i18n/validators.js";

export default class CoreValidators extends Validators {
	rechazar(data) {
		if (!data) // method not implemented => error
			throw new Error("Method 'rechazar' must be implemented.");
		return this.size500("rechazo", data.rechazo, "errRechazar").close(data); // Required string
	}
}
