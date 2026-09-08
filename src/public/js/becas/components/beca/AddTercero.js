
import api from "../../../core/components/Api.js";
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

		const fTercero = document.forms.tercero;
		const item = this.form.tercero.getCurrent();
		if (fTercero.isCached(item.value)) // is cached
			return fTercero.show(); // show cached data

		api.init().json("/uae/becas/tercero?id=" + item.value).then(data => {
			fTercero.load(data.tercero, data.cuentas); // show tercero tab
		});
	}
}
