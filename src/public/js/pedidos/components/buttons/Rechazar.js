
import i18n from "../../i18n/langs.js";
import api from "../../../core/components/Api.js"
import tabs from "../../../core/components/helper/Tabs.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";
import pedido from "../../model/Pedido.js";

export default class ButtonRechazar extends ButtonForm {
	setEditable() {
		this.setVisible(pedido.isFirmable());
	}

	execute() {
		if (!tabs.isActive("reject"))
			return tabs.show("reject"); // move to reject tab
		const el = this.form.elements.rechazo; // textarea input
		if (!el.force("errRechazar") || !i18n.confirm("msgRechazar")) return; // validation error or cancel by user
		const params = { id: pedido.getId(), rechazo: el.getValue() }; // url params
		const fnThen = data => this.form.close(data.firmas, pedido.setRechazada());
		api.init().json("/uae/pedidos/rechazar", params).then(fnThen);
	}
}
