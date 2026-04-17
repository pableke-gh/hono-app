
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import i18n from "../i18n/langs.js";
import valid from "../i18n/validators.js";

import form from "../modules/presto.js";
import ButtonForm from "../../components/inputs/ButtonForm.js"

export default class ButtonSave extends ButtonForm {
	execute() {
		if (valid.all() && i18n.confirm("msgSend")) // validate and user confirmation
			api.setFormData(form.getFormData()).send("/uae/presto/save").then(tabs.showInit);
	}

	connectedCallback() { // init. component
		this.setExecutable(); // click event
	}
}
