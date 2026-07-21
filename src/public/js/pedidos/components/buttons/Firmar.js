
import i18n from "../../i18n/langs.js";
import api from "../../../core/components/Api.js"
import ButtonForm from "../../../core/components/forms/ButtonForm.js";
import pedido from "../../model/Pedido.js";

export default class ButtonFirmar extends ButtonForm {
	setEditable() {
		this.setVisible(pedido.isFirmable());
	}

	execute() {
		const row = this.form.getPedidos().getCurrent(); // current row
		const url = "/uae/pedidos/firmar?id=" + row.id; // url de firma
		i18n.confirm("msgFirmar") && api.init().json(url).then(data => {
			pedido.procesando(row); // update current state
			this.form.close(data.firmas); // update view
		});
	}
}
