
import tabs from "../../../core/components/tabs/Tabs.js";
import valid from "../../i18n/validators/irse.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import observer from "../../../core/util/Observer.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class SendPaso9 extends ButtonForm {
	setEditable() {
		this.setVisible(irse.isEditable());
		this.setDisabled(!irse.isEditable());
	}

	execute() {
		if (!valid.paso9() || !i18n.confirm("msgFirmarEnviar"))
			return; // not valid or cancelled by user
		form.getPaso9().send("/uae/iris/paso9/send").then(data => {
			form.setFirmas(data.firmas).setEditable(irse.setProcesando()).refresh(irse); // update form
			form.getSolicitudes().reloadRow(); // try to update row list state (for editing)
			observer.emit("close"); // no parameter needed
			tabs.showInit(); // return to init tab
		});
	}
}
