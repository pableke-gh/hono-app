
import tabs from "../../../core/components/tabs/TabsOld.js";
import api from "../../../core/components/Api.js"
import i18n from "../../i18n/langs.js";
import valid from "../../i18n/validators.js";

import presto from "../../model/Presto.js";
import form from "../../modules/presto.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js"

export default class ButtonSave extends ButtonForm {
	setEditable() {
		this.setVisible(presto.isEditable());
		this.setDisabled(!presto.isEditable());
	}

	execute() {
		if (valid.all() && i18n.confirm("msgSend")) // validate and user confirmation
			api.setFormData(form.getFormData()).send("/uae/presto/save").then(tabs.showInit);
	}
}
