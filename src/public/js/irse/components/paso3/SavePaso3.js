
import valid from "../../i18n/validators/irse.js";
import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import paso3 from "../../modules/tabs/paso3.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js";

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
		paso3.save(); // send data to server
	}

}
