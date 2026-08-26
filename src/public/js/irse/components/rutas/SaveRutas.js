
import valid from "../../i18n/validators/rutas.js";
import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class SaveRutas extends ButtonForm {

	setEditable() {
		this.setVisible(irse.isEditable());
		this.setDisabled(!irse.isEditable());
	}

	execute() {
		if (!valid.itinerario()) return; // if error => stop
		if (!form.isChanged()) return form.setOk(); // nada que guardar
		form.getRutas().send(); // send data from rutas to server
	}

}
