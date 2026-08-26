
import tabs from "../../../core/components/tabs/Tabs.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";
import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";

export default class RemoveButton extends ButtonForm {
	setEditable() {
		this.setVisible(irse.isRemovable());
	}

	execute() {
		form.getSolicitudes().remove(); // execute remove action
	}
}
