
import i18n from "../../i18n/langs.js";
import api from "../../../core/components/Api.js"
import tabs from "../../../core/components/tabs/Tabs.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";
import beca from "../../model/Beca.js";

export default class ButtonRechazar extends ButtonForm {
	setEditable() {
		this.setVisible(beca.isFirmable());
	}

	execute() {
		if (!tabs.isActive("reject"))
			return tabs.show("reject"); // move to reject tab

		const el = this.form.elements.rechazo; // textarea input
		if (!el.force("errRechazar") || !i18n.confirm("msgRechazar"))
			return; // validation error or cancel by user

		const row = this.form.getBecas().getCurrent(); // current row
		const params = { id: row.id, rechazo: el.getValue() }; // url params
		api.init().json("/uae/pedidos/rechazar", params).then(data => {
			beca.rechazar(row); // update current row
			this.form.close(data.firmas); // update view
		});
	}
}
