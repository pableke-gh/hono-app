
import pedido from "../../model/Pedido.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class ButtonReport extends ButtonForm {
	setEditable() {
		this.setVisible(pedido.isDocumentable());
	}

	execute() {
		this.form.getTable().report(); // execute report action
	}
}
