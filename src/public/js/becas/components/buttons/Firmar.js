
import i18n from "../../i18n/langs.js";
import api from "../../../core/components/Api.js"
import ButtonForm from "../../../core/components/forms/ButtonForm.js";
import beca from "../../model/Beca.js";

export default class ButtonFirmar extends ButtonForm {
	setEditable() {
		this.setVisible(beca.isFirmable());
	}

	execute() {
		const row = this.form.getBecas().getCurrent(); // current row
		const url = "/uae/becas/firmar?id=" + row.id; // url de firma
		i18n.confirm("msgFirmar") && api.init().json(url).then(data => {
			beca.procesando(row); // update current state
			this.form.close(data.firmas); // update view
		});
	}
}
