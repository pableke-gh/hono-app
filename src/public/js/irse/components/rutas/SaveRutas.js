
import valid from "../../i18n/validators/rutas.js";
import form from "../../modules/irse.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js";

export default class SaveRutas extends ButtonForm {

	execute() {
		if (!valid.itinerario()) return; // if error => stop
		if (!form.isChanged()) return form.setOk(); // nada que guardar
		form.getRutas().save(); // send data from rutas to server
	}

}
