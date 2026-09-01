
import api from "../../../core/components/Api.js";
import irse from "../../model/Irse.js";
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";

export default class Organica extends AutocompleteHTML {
	load() { return this; } // not to load on view
	toData(data) { data[this.name] = this.getCode(); }
	setEditable() { this.setReadonly(false); }

	source() { api.init().json("/uae/iris/organicas", { term: this.value }).then(this.render); }
	row(organica) { return (organica.o + " - " + organica.dOrg); }
	select(organica) { return organica.id; }

	validate() {
		return this.isLoaded() || !this.setRequired("Debe seleccionar una órganica de uxxi-ec.")
	}

	connectedCallback() {
		this.setMinLength(4); // Initialize element after form
	}
}
