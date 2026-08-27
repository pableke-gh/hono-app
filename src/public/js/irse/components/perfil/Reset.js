
import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class Reset extends ButtonForm {
	setEditable() {
		this.setVisible(irse.isEditableP0());
	}

	execute() {
		form.closeAlerts();
		this.form.elements.organica.clear();
		this.form.elements.organica.getOrganicas().reset();
		this.form.elements.interesado.reload();
		this.form.reset(); // fire default action
	}
}
