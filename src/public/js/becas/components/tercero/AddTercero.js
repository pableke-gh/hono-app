
import tabs from "../../../core/components/tabs/Tabs.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";
import beca from "../../model/Beca.js";

export default class ButtonAddTercero extends ButtonForm {
	setEditable() {
		this.setVisible(beca.isEditable());
	}

	execute() {
		tabs.showForm();
	}
}
