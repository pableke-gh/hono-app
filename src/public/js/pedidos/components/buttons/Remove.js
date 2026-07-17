
import tabs from "../../../core/components/tabs/Tabs.js";
import pedido from "../../model/Pedido.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class ButtonRemove extends ButtonForm {
	setEditable() {
		this.setVisible(pedido.isRemovable());
	}

	execute() {
		this.form.getPedidos().remove(); // execute remove action
		tabs.showList(); // force to show list tab
	}
}
