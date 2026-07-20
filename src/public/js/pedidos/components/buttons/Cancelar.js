
import i18n from "../../i18n/langs.js";
import api from "../../../core/components/Api.js"
import tabs from "../../../core/components/tabs/Tabs.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";
import pedido from "../../model/Pedido.js";

export default class ButtonCancelar extends ButtonForm {
	setEditable() {
		this.setVisible(pedido.isCancelable());
	}

	execute() {
		if (!tabs.isActive("reject"))
			return tabs.show("reject"); // move to reject tab

		const el = this.form.elements.rechazo; // textarea input
		if (!el.force("errRechazar") || !i18n.confirm("msgCancelar"))
			return; // validation error or cancel by user

		const row = this.form.getPedidos().getCurrent(); // current row
		const params = { id: row.id, rechazo: el.getValue() }; // url params
		api.init().json("/uae/pedidos/cancelar", params).then(data => {
			pedido.cancelar(row); // update current row
			this.form.close(data.firmas); // update view
		});
	}
}
