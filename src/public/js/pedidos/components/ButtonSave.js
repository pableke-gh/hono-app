
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import i18n from "../i18n/langs.js";

import pedido from "../model/Pedido.js";
import ButtonForm from "../../components/inputs/ButtonForm.js"

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
