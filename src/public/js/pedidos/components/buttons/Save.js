
import i18n from "../../i18n/langs.js";
import api from "../../../core/components/Api.js"
import tabs from "../../../core/components/tabs/Tabs.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";
import pedido from "../../model/Pedido.js";

export default class ButtonSave extends ButtonForm {
	setEditable() {
		this.setVisible(pedido.isEditable());
		this.setDisabled(!pedido.isEditable());
	}

	execute() {
		if (this.form.validate() && i18n.confirm("msgSend")) // validate and user confirmation
			api.setFormData(this.form.getFormData()).json("/uae/pedidos/save").then(tabs.showInit);
	}
}
