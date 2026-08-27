
import api from "../../../core/components/Api.js";
import valid from "../../i18n/validators/irse.js";

import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import tabs from "../../modules/tabs.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class AddOrganica extends ButtonForm {
	setEditable() {
		this.setVisible(irse.isEditable());
		this.setDisabled(!irse.isEditable());
	}

	execute() {
		const organica = this.form.elements.organica;
		const current = organica.getItem(); // current item selected
		current ? organica.getOrganicas().push(current) : organica.reload();
		organica.reset().setLabel(); // clear autocomplete => data in table
	}
}
