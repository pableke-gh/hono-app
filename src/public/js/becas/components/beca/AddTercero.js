
import api from "../../../core/components/Api.js";
import tabs from "../../../core/components/tabs/Tabs.js";

import beca from "../../model/Beca.js";
import tercero from "../../model/Tercero.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class AddTercero extends ButtonForm {
	setEditable() {
		this.setVisible(beca.isEditable());
	}

	execute() {
		this.form.closeAlerts();
		if (this.form.tercero.isEmpty())
			return this.form.tercero.setRequired("Debe seleccionar un tercero de UXXI-EC");

		const item = this.form.tercero.getCurrent();
		api.init().json("/uae/becas/tercero?id=" + item.value).then(data => {
			tercero.setData(data.tercero); // update tercero model
			this.form.cuentas.setCuentas(data.cuentas); // update cuentas list
			tabs.show("tercero"); // show tercero tab
		});
	}
}
