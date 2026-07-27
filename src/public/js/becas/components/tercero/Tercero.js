
import Autocomplete from "../../../core/components/forms/Autocomplete.js";
import api from "../../../core/components/Api.js";

import beca from "../../model/Beca.js";
import tercero from "../../model/Tercero.js";

export default class Tercero extends Autocomplete {
	connectedCallback() {
		this.setMinLength(4); // init. component
	}

	setEditable() {
		this.setReadonly(!beca.isEditable());
	}

	// los usuarios de ttpp/gaca solo pueden ver las organicas de su unidad 300906XXXX
	source() { api.init().json("/uae/becas/terceros", { term: this.value }).then(this.render); }
	row(row) { return tercero.buildNifName(row); }
	select(tercero) { return tercero.id; }
}
