
import i18n from "../../i18n/langs.js";
import api from "../../../core/components/Api.js"
import tabs from "../../../core/components/tabs/Tabs.js";

import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class ButtonCancelar extends ButtonForm {
	setEditable() {
		this.setVisible(irse.isCancelable());
	}

	execute() { // click event button
		if (!tabs.isActive("reject"))
			return form.showReject(irse.getData()); // move to reject tab

		const el = form.getElement("rechazo"); // textarea input
		if (!el.force("errRechazar") || !i18n.confirm("msgCancelar"))
			return; // validation error or cancel by user

		const row = form.getSolicitudes().getCurrent(); // current row
		const params = { id: row.id, rechazo: el.getValue() }; // url params
		api.init().json("/uae/iris/cancelar", params).then(data => {
			irse.cancelar(row); // update current row
			form.close(data); // update view
		});
	}
}
