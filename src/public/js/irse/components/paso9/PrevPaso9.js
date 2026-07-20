
import tabs from "../../../core/components/tabs/TabsOld.js";
import valid from "../../i18n/validators/irse.js";

import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import paso9 from "../../modules/paso9.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js";

export default class PrevPaso9 extends ButtonForm {
	setEditable() {
		this.setDisabled(false); // always enabled
	}

	execute() {
		if (valid.paso9() && irse.isEditable() && form.isChanged()) // is valid change
			paso9.save("/uae/iris/paso9/save"); // send data to server and go back
		else // reset change flag to avoid unnecessary saves
			form.setChanged(false);
		tabs.back(this.dataset.tab || 6); // go back tab
	}
}
