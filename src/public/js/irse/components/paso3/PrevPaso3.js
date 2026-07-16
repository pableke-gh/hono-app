
import tabs from "../../../core/components/tabs/TabsOld.js";
import valid from "../../i18n/validators/irse.js";
import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import paso3 from "../../modules/paso3.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js";

export default class PrevPaso3 extends ButtonForm {

	setEditable() {
		this.setDisabled(false); // always enabled
	}

	execute() {
		if (valid.paso3() && irse.isEditable() && form.isChanged()) // is valid change
			paso3.save(); // send data to server
		else // reset change flag to avoid unnecessary saves
			form.setChanged(false);
		tabs.back(); // go back tab
	}

}
