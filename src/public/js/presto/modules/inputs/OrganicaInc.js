
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import api from "../../../components/Api.js";

import presto from "../../model/Presto.js";
import form from "../presto.js";

export default class OrganicaInc extends AutocompleteHTML {
	constructor() {
		super(); // Must call super before 'this'
		this.setMinLength(4); // default initialization
	}

	source() {
		const url = presto.isGcr() ? "/uae/presto/organicas/inc/gcr" : "/uae/presto/organicas/inc"; // url by type
		api.init().json(url, { ej: form.getValue("ejInc"), term: this.value }).then(this.render); // send fetch
	}
}
