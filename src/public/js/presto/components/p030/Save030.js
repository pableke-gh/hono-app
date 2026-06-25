
import alerts from "../../../core/components/helpers/Alerts.js";
import tabs from "../../../core/components/helpers/Tabs.js";
import api from "../../../core/components/Api.js"
import valid from "../../i18n/validators.js";

import presto from "../../model/Presto.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js"

export default class Save030 extends ButtonForm {
	setEditable() {
		this.setVisible(presto.isEditableUae());
		this.setDisabled(!presto.isEditableUae());
	}

	execute() {
		if (!valid.validate030()) // validate partida 080 / 030
			return false; // not valid data

		if (presto.isEditable() || !this.form.isChanged()) { // if editable => back
			tabs.prev(); // go back to main form
			return alerts.setOk("msgSave030"); // show msg ok
		}

		const data = this.form.getPartidas().getData();
		api.setJSON(data).json("/uae/presto/save/030").then(tabs.showForm);
		this.form.setChanged();
	}
}
