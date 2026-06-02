
import tabs from "../../../components/Tabs.js";
import valid from "../../i18n/validators/irse.js";

import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import paso3 from "../../modules/tabs/paso3.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js";

export default class NextPaso3 extends ButtonForm {

	setEditable() {
		this.setDisabled(false); // always enabled
	}

	execute() {
		if (!valid.paso3()) return; // if error => stop
		if (!irse.isEditable() || !form.isChanged())
			return tabs.next(); // go next tab directly
		paso3.save().then(() => tabs.goTo(5)); // send data and go next tab
	}

}
