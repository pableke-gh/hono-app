
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import api from "../../../core/components/Api.js";
import factura from "../../model/Factura.js";

export default class Organica extends AutocompleteHTML {
	constructor() {
		super(); // Must call super before 'this'
		this.setMinLength(4); // init. component
	}

	load(data) { this.setValue(data.idOrg, data.org + " - " + data.descOrg); }
	setEditable() { this.setReadonly(!factura.isEditable()); }

	// los usuarios de ttpp/gaca solo pueden ver las organicas de su unidad 300906XXXX
	source() { api.init().json("/uae/fact/organicas", { term: this.value }).then(this.render); }
}
