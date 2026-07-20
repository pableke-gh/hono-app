
import i18n from "../../i18n/langs.js";
import api from "../../../core/components/Api.js"
import tabs from "../../../core/components/tabs/Tabs.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";
import beca from "../../model/Beca.js";

export default class ButtonSave extends ButtonForm {
	setEditable() {
		this.setVisible(beca.isEditable());
		this.setDisabled(!beca.isEditable());
	}

	execute() {
		if (this.form.validate() && i18n.confirm("msgSend")) // validate and user confirmation
			api.setFormData(this.form.getFormData()).json("/uae/becas/save").then(tabs.showInit);
	}
}
