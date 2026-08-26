
import valid from "../../i18n/validators/irse.js";
import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class SavePaso9 extends ButtonForm {
	setEditable() {
		this.setVisible(irse.isEditable());
		this.setDisabled(!irse.isEditable());
	}

	execute() {
		if (valid.paso9()) // ok => save data
			form.getPaso9().send("/uae/iris/paso9/save");
		else // reset change flag to avoid unnecessary saves
			form.setChanged(false);
	}
}
