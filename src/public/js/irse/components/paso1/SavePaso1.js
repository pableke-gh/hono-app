
import valid from "../../i18n/validators/rutas.js";
import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class SavePaso1 extends ButtonForm {
	setEditable() {
		this.setVisible(irse.isEditable());
		this.setDisabled(!irse.isEditable());
	}

	execute() {
		if (!valid.paso1()) return; // if error => stop
		if (!form.isChanged()) return form.setOk(); // nada que guardar
		form.getPaso1().send().then(form.setOk);
	}

}
