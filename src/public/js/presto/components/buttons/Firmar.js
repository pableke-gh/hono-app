
import api from "../../../core/components/Api.js"
import valid from "../../i18n/validators.js";
import i18n from "../../i18n/langs.js";

import presto from "../../model/Presto.js";
import form from "../../modules/presto.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class ButtonFirmar extends ButtonForm {
	setEditable() {
		this.setVisible(presto.isFirmable());
	}

	firmar(row) { // table action link
		//row = row || form.getSolicitudes().getCurrent(); // current row
		const url = "/uae/presto/firmar?id=" + row.id; // url de firma
		i18n.confirm("msgFirmar") && api.init().json(url).then(res => {
			presto.procesando(row); // update current state
			form.close(res); // update view
		});
	}

	execute() { // form click event button
		const data = valid.firmar(); // form data
		if (!data || !i18n.confirm("msgFirmar"))
			return; // validation error or cancel by user

		const row = form.getSolicitudes().getCurrent(); // current row
		Object.assign(row, presto.getData(), data); // merge data
		api.setJSON(row).json("/uae/presto/firmar").then(res => { // post method
			presto.procesando(row); // update current state
			form.close(res); // update view
		});
	}
}
