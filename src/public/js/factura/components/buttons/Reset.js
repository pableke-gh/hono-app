
import tabs from "../../../core/components/tabs/TabsOld.js";
import api from "../../../core/components/Api.js"
import i18n from "../../i18n/langs.js";
import valid from "../../i18n/validators.js";

import factura from "../../model/Factura.js";
import form from "../../modules/factura.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js"

export default class ButtonReset extends ButtonForm {
	setEditable() {
		this.setVisible(factura.isSubsanableGaca());
		this.setDisabled(!factura.isSubsanableGaca());
	}

	execute() {
		const data = valid.all(); // form data
		if (data && i18n.confirm("msgSave")) // validate and user confirmation
			api.setJSON(form.getFormData(data)).json("/uae/fact/reset").then(tabs.showList);
	}
}
