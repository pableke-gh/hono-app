
import factura from "../../model/Factura.js";
import form from "../../modules/factura.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class ButtonRemove extends ButtonForm {
	setEditable() {
		this.setVisible(factura.isRemovable());
	}

	execute() {
		form.getSolicitudes().remove(); // execute remove action
	}
}
