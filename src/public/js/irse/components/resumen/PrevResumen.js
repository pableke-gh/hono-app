
import tabs from "../../../core/components/tabs/TabsOld.js";
import valid from "../../i18n/validators/irse.js";

import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import resumen from "../../modules/resumen.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js";

export default class PrevResumen extends ButtonForm {

	setEditable() {
		this.setDisabled(false); // always enabled
	}

	execute() {
		const km = resumen.getKilometraje().getResume();
		if (valid.resumen(km) && irse.isEditable() && form.isChanged()) // is valid change
			resumen.save(); // send data to server and go back
		else // reset change flag to avoid unnecessary saves
			form.setChanged(false);
		tabs.back(this.dataset.tab || 5); // go back tab
	}

}
