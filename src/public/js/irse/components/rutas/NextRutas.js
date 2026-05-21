
import tabs from "../../../components/Tabs.js";
import valid from "../../i18n/validators/rutas.js";

import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js";

export default class NextRutas extends ButtonForm {

	setEditable() {
		this.setDisabled(false); // always enabled
	}

	execute() {
		if (!valid.itinerario()) return; // if error => stop
		if (!irse.isEditable() || !form.isChanged()) return tabs.next(); // go next tab directly
		form.getRutas().save().then(() => tabs.goTo()); // go next tab with messages
	}

}
