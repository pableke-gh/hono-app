
import AutocompleteHTML from "../../components/inputs/AutocompleteHTML.js";
import api from "../../components/Api.js";

export default class Organica extends AutocompleteHTML {
	constructor() {
		super(); // Must call super before 'this'
		this.setMinLength(4); // default initialization
	}


	load(data) {
		this.setValue(data.idOrg030, data.o030 + " - " + data.dOrg030);
	}

	source() { api.init().json("/uae/pedidos/organicas", { term: this.value }).then(this.render); }
	//select(item) { return item.value; }
}
