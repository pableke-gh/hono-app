
import pedido from "../../model/Pedido.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class ButtonRemove extends ButtonForm {
	setEditable() {
		this.setVisible(pedido.isRemovable());
	}

	execute() {
		this.form.getTable().remove(); // execute remove action
	}
}
