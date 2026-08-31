
import api from "../../../core/components/Api.js"
import valid from "../../i18n/validators/irse.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class Excel extends ButtonForm {
	setEditable() {
		this.setReadonly(false);
	}

	execute() { // form click event button
	}
}
