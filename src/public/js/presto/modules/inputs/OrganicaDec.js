
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import api from "../../../components/Api.js";

import presto from "../../model/Presto.js";
import form from "../presto.js";

export default class OrganicaDec extends AutocompleteHTML {
	constructor() {
		super(); // Must call super before 'this'
		this.setMinLength(4); // default initialization
	}

	source() {
		const opts = { 3: "/uae/presto/organicas/l83", 5: "/uae/presto/organicas/ant" };
		const url = opts[presto.getTipo()] || "/uae/presto/organicas/dec"; // default url
		api.init().json(url, { ej: form.getValue("ej"), term: this.value }).then(this.render);
	}
}
