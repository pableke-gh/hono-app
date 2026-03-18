
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import api from "../../../components/Api.js";
import form from "../presto.js";

export default class Organica030 extends AutocompleteHTML {
	constructor() {
		super(); // Must call super before 'this'
		this.setMinLength(4); // default initialization
		this.addListener("afterSelect", () => form.setValue("eco030", this.getCurrent().imp));
	}

	source = () => {
		api.init().json("/uae/presto/organicas/030", { ej: form.getValue("ej030"), term: this.value }).then(this.render);
	}
}
