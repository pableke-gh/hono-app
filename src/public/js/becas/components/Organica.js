
import Autocomplete from "../../core/components/forms/Autocomplete.js";
import api from "../../core/components/Api.js";
import beca from "../model/Beca.js";

export default class Organica extends Autocomplete {
	connectedCallback() {
		this.setMinLength(4); // init. component
	}

	setEditable() {
		this.setReadonly(!beca.isEditable());
	}

	// los usuarios de ttpp/gaca solo pueden ver las organicas de su unidad 300906XXXX
	source() { api.init().json("/uae/becas/organicas", { term: this.value }).then(this.render); }

	validate() {
		return this.isLoaded() || this.setRequired(); // required
	}
}
