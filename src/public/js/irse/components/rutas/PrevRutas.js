
import tabs from "../../../components/Tabs.js";
import valid from "../../i18n/validators/rutas.js";

import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js";

export default class PrevRutas extends ButtonForm {

	execute() {
		if (valid.itinerario() && irse.isEditable() && form.isChanged()) // is valid change
			form.getRutas().save(); // send data to server and go back
		tabs.back(); // go back tab
	}

}
