
import api from "../../../core/components/Api.js";
import beca from "../../model/Beca.js";
import Autocomplete from "../../../core/components/forms/Autocomplete.js";

export default class Tercero extends Autocomplete {
	connectedCallback() {
		this.setMinLength(4); // init. component
	}

	setEditable() {
		this.setReadonly(!beca.isEditable());
	}

	source() {
		api.init().json("/uae/becas/terceros", { term: this.value }).then(this.render);
	}
}
