
import tabs from "../../../components/Tabs.js";
import api from "../../../core/components/Api.js"
import i18n from "../../i18n/langs.js";
import valid from "../../i18n/validators.js";

import factura from "../../model/Factura.js";
import form from "../../modules/factura.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js"

export default class ButtonSubsanar extends ButtonForm {
	setEditable() {
		this.setVisible(factura.isSubsanableUae());
		this.setDisabled(!factura.isSubsanableUae());
	}

	execute() {
		const data = valid.all(); // form data
		if (data && i18n.confirm("msgSave")) // validate and user confirmation
			api.setJSON(form.getFormData(data)).json("/uae/fact/subsanar").then(tabs.showList);
	}
}
