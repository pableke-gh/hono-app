
import ButtonForm from "../../../core/components/forms/ButtonForm.js";
import beca from "../../model/Beca.js";

export default class ButtonReport extends ButtonForm {
	setEditable() {
		this.setVisible(beca.isDocumentable());
	}

	execute() {
		this.form.getBecas().report(); // execute report action
	}
}
