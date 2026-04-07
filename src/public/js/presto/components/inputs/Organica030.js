
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import api from "../../../components/Api.js";
import form from "../../modules/presto.js";

export default class Organica030 extends AutocompleteHTML {
	constructor() {
		super(); // Must call super before 'this'
		this.setMinLength(4); // default initialization
	}


	load(data) {
		this.setValue(data.idOrg030, data.o030 + " - " + data.dOrg030);
	}

	source() { api.init().json("/uae/presto/organicas/030", { ej: form.getValue("ej030"), term: this.value }).then(this.render); }
	select(item) { form.setValue("eco030", item.imp); return item.value; }
}
