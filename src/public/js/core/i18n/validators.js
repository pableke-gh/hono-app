
import Validators from "../../i18n/validators.js";

export default class CoreValidators extends Validators {
	rechazar(data) {
		if (!data) // method not implemented => error
			throw new Error("Method 'rechazar' must be implemented.");
		const msg = "Debe indicar un motivo para el rechazo de la solicitud.";
		return this.size500("rechazo", data.rechazo, msg).close(data); // Required string
	}
}
