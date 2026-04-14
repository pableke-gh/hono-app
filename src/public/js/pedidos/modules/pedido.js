import FormHTML from "../../components/forms/FormHTML.js";
import pedido from "../model/Pedido.js";

export default class PedidoForm extends FormHTML {
	connectedCallback() {
		this.onSubmit(ev => {
			//todo: api upload multipart form
		});
	}

	view() {
		
	}
}
