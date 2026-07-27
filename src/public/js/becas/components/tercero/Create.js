
import ButtonForm from "../../../core/components/forms/ButtonForm.js";
import alerts from "../../../core/components/alerts/Alerts.js";
import tabs from "../../../core/components/tabs/Tabs.js";
import tables from "../tables/tables.js";

import beca from "../../model/Beca.js";
import tercero from "../../model/Tercero.js";

export default class ButtonCreateTercero extends ButtonForm {
	setEditable() {
		this.setVisible(beca.isEditable());
	}

	execute() {
		if (!this.form.validate(".ui-tercero"))
			return; // validation error

		const terceros = tables.get("terceros");
		const data = this.form.getData(".ui-tercero");
		tercero.setData(data).create(); // update form data for create
		if (terceros.contains(tercero.getNif())) // verifico si el nif ya esta asociado
			return alerts.setWarn("Beneficiario asociado previamente a la solicitud");

		terceros.add(tercero.getData()); // add data row
		tabs.showForm(); // vuelvo al form principal
	}
}
