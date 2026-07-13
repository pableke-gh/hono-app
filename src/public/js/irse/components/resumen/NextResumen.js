
import tabs from "../../../core/components/tabs/TabsOld.js";
import valid from "../../i18n/validators/irse.js";

import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import resumen from "../../modules/tabs/resumen.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js";

export default class NextResumen extends ButtonForm {

	setEditable() {
		this.setDisabled(false); // always enabled
	}

	execute() {
		const km = resumen.getKilometraje().getResume();
		if (!valid.resumen(km))
			return; // if error => stop
		if (!irse.isEditable() || !form.isChanged())
			return tabs.next(); // go next tab directly
		resumen.save().then(() => tabs.goTo());
	}

}
