
import alerts from "../../../core/components/alerts/Alerts.js";
import api from "../../../core/components/Api.js"
import valid from "../../i18n/validators.js";
import i18n from "../../i18n/langs.js";

import factura from "../../model/Factura.js";
import form from "../../modules/factura.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class ButtonFirmar extends ButtonForm {
	setEditable() {
		this.setVisible(factura.isFirmable());
	}

	firmar(row) { // table action link
		//row = row || form.getSolicitudes().getCurrent(); // current row
		const msgs = factura.validate(row); // validate model data
		if (msgs.isError()) // validation failed
			return alerts.setError(msgs.getError());

		const url = "/uae/fact/firmar?id=" + row.id; // url de firma
		i18n.confirm("msgFirmar") && api.init().json(url).then(res => {
			factura.procesando(row); // update current state
			form.close(res); // update view
		});
	}

	execute() { // form click event button
		const data = valid.all(); // form data
		if (!data || !i18n.confirm("msgFirmar"))
			return; // validation error or cancel by user

		const row = form.getSolicitudes().getCurrent(); // current row
		Object.assign(row, factura.getData(), data); // merge data
		api.setJSON(row).json("/uae/fact/firmar").then(res => { // post method
			factura.procesando(row); // update current state
			form.close(res); // update view
		});
	}
}
