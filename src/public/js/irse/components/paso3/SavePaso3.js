
import valid from "../../i18n/validators/irse.js";
import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class SavePaso3 extends ButtonForm {
	setEditable() {
		this.setVisible(irse.isEditable());
		this.setDisabled(!irse.isEditable());
	}

	execute() {
		if (!valid.paso3())
			return; // if error => stop
		if (!form.isChanged())
			return form.setOk(); // nada que guardar
		form.getPaso3().send(); // send data to server
	}

}
