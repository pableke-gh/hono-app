
import ButtonForm from "../../../core/components/forms/ButtonForm.js";
import beca from "../../model/Beca.js";

export default class ButtonRemove extends ButtonForm {
	setEditable() {
		this.setVisible(beca.isRemovable());
	}

	execute() {
		this.form.getBecas().remove(); // execute remove action
	}
}
