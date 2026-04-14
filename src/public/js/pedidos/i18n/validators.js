
import Validators from "../../core/i18n/validators.js";
import pedido from "../model/Pedido.js";
import form from "../modules/pedido.js";

class PedidosValidators extends Validators {
	success(data) { form.closeAlerts(); this.reset(); return data; } // Succesful validations
	fail(msg) { form.setErrors(super.fail(msg)); return !this.reset(); } // force error for validation
	rechazar() { return super.rechazar(form.getData()); } // specific implementation
}

export default new PedidosValidators();
