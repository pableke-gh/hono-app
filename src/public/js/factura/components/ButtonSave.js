
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import i18n from "../i18n/langs.js";
import valid from "../i18n/validators.js";

import form from "../modules/factura.js";
import ButtonForm from "../../components/inputs/ButtonForm.js"

export default class ButtonSave extends ButtonForm {
	execute() {
		const data = valid.all(); // form data
		if (data && i18n.confirm("msgSend")) // validate and user confirmation
			api.setJSON(form.getFormData(data)).json("/uae/fact/save").then(tabs.showInit);
	}

	connectedCallback() { // init. component
		this.setExecutable(); // click event
	}
}
