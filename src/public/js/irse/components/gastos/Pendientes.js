
import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import tables from "../tables/tables.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class Pendientes extends ButtonForm {
	setEditable() {
		this.setVisible(irse.isEditable());
		this.setDisabled(!irse.isEditable());
	}

	execute() {
		const rutas = tables.get("pendientes").getChecked();
		if (!rutas || !rutas.length) // no hay rutas seleccionadas
			return form.showError("errLinkRuta"); // mensaje de error
		this.form.elements.upload.upload(rutas.join()); // upload PK de las rutas seleccionadas
	}
}
