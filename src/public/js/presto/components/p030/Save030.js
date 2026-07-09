
import tabs from "../../../components/Tabs.js";
import api from "../../../core/components/Api.js"
import valid from "../../i18n/validators.js";

import presto from "../../model/Presto.js";
import form from "../../modules/presto.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js"

export default class Save030 extends ButtonForm {
	setEditable() {
		this.setVisible(presto.isEditableUae());
		this.setDisabled(!presto.isEditableUae());
	}

	execute() {
		if (!valid.validate030()) // validate partida 080 / 030
			return false; // not valid data

		if (presto.isEditable() || !form.isChanged()) // if editable => back
			return tabs.back().showOk("msgSave030"); // show msg ok

		const data = form.getPartidas().getData();
		api.setJSON(data).json("/uae/presto/save/030").then(tabs.showForm);
		form.setChanged();
	}
}
