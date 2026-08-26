
import presto from "../../model/Presto.js";
import form from "../../modules/presto.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class ButtonRemove extends ButtonForm {
	setEditable() {
		this.setVisible(presto.isRemovable());
	}

	execute() {
		form.getSolicitudes().remove(); // execute remove action
	}
}
