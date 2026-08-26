
import api from "../../../core/components/Api.js"
import valid from "../../i18n/validators/irse.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class ButtonFirmar extends ButtonForm {
	setEditable() {
		this.setVisible(irse.isFirmable());
	}

	firmar(row) { // table action link
		row = row || form.getSolicitudes().getCurrent(); // current row
		const url = "/uae/iris/firmar?id=" + row.id; // url de firma
		i18n.confirm("msgFirmar") && api.init().json(url).then(res => {
			irse.procesando(row); // update current state
			form.close(res); // update view
		});
	}

	execute() { // form click event button
		if (valid.perfil() && valid.paso9()) // validate data
			this.firmar(); // call action
	}
}
