
import i18n from "../../i18n/langs.js";
import api from "../../../core/components/Api.js"
import tabs from "../../../core/components/tabs/Tabs.js";

import factura from "../../model/Factura.js";
import form from "../../modules/factura.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class ButtonRechazar extends ButtonForm {
	setEditable() {
		this.setVisible(factura.isFirmable());
	}

	execute() { // click event button
		if (!tabs.isActive("reject"))
			return tabs.show("reject"); // move to reject tab

		const el = form.getElement("rechazo"); // textarea input
		if (!el.force("errRechazar") || !i18n.confirm("msgRechazar"))
			return; // validation error or cancel by user

		const row = form.getSolicitudes().getCurrent(); // current row
		const params = { id: row.id, rechazo: el.getValue() }; // url params
		api.init().json("/uae/fact/rechazar", params).then(data => {
			factura.rechazar(row); // update current row
			form.close(data); // update view
		});
	}
}
