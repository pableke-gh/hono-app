
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import i18n from "../i18n/langs.js";
import valid from "../i18n/validators.js";

import factura from "../model/Factura.js";
import form from "../modules/factura.js";
import ButtonForm from "../../components/inputs/ButtonForm.js"

export default class ButtonSave extends ButtonForm {
	setEditable() {
		this.setVisible(factura.isEditable());
		this.setDisabled(!factura.isEditable());
	}

	execute() {
		const data = valid.all(); // form data
		if (data && i18n.confirm("msgSend")) // validate and user confirmation
			api.setJSON(form.getFormData(data)).json("/uae/fact/save").then(tabs.showInit);
	}
}
