
import valid from "../../i18n/validators/irse.js";
import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class SaveResumen extends ButtonForm {
	setEditable() {
		this.setVisible(irse.isEditable());
		this.setDisabled(!irse.isEditable());
	}

	execute() {
		const resumen = form.getResumen(); // tab resumen id = 6
		const km = resumen.getKilometraje().getResume();
		if (!valid.resumen(km))
			return; // if error => stop
		if (!form.isChanged())
			return form.setOk(); // nada que guardar => mensaje ok
		resumen.send(); // call server
	}

}
