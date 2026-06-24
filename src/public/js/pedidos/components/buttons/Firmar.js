
import i18n from "../../i18n/langs.js";
import api from "../../../core/components/Api.js"
import ButtonForm from "../../../core/components/forms/ButtonForm.js";
import pedido from "../../model/Pedido.js";

export default class ButtonFirmar extends ButtonForm {
	setEditable() {
		this.setVisible(pedido.isFirmable());
	}

	execute() {
		const url = "/uae/pedidos/firmar?id=" + pedido.getId();
		const fnThen = data => this.form.close(data.firmas, pedido.setProcesando());
		i18n.confirm("msgFirmar") && api.init().json(url).then(fnThen);
	}
}
