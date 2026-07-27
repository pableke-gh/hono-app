
import ButtonForm from "../../../core/components/forms/ButtonForm.js";
import tabs from "../../../core/components/tabs/Tabs.js";
import tables from "../tables/tables.js";

import beca from "../../model/Beca.js";
import tercero from "../../model/Tercero.js";

export default class AddTercero extends ButtonForm {
	setEditable() {
		this.setVisible(beca.isEditable());
	}

	execute() {
		const acTercero = this.form.elements.tercero;
		if (acTercero.isEmpty())
			return acTercero.setRequired("Debe seleccionar un tercero de UXXI-EC");
		acTercero.setOk(); // update input state

		const elImporte = this.form.elements.imp;
		if (!elImporte.force("Bebe indicar el importe concedido al beneficiario"))
			return; // el importe concedido debe ser mayor de 0

		const terceros = tables.get("terceros");
		tercero.setData(acTercero.getCurrent()).setImporte(elImporte.getValue());
		if (!terceros.contains(tercero.getNif()))
			terceros.add(tercero.getData()); // add data row

		this.form.closeAlerts();
		acTercero.reload();
		elImporte.reset();
	}
}
