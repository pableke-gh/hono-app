
import valid from "../../i18n/validators/irse.js";
import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import paso9 from "../../modules/paso9.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js";

export default class SavePaso9 extends ButtonForm {
	setEditable() {
		this.setVisible(irse.isEditable());
		this.setDisabled(!irse.isEditable());
	}

	execute() {
		if (valid.paso9()) // ok => save data
			paso9.save("/uae/iris/paso9/save");
		else // reset change flag to avoid unnecessary saves
			form.setChanged(false);
	}
}
