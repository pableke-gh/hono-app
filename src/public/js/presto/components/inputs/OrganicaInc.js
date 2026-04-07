
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import api from "../../../components/Api.js";

import presto from "../../model/Presto.js";
import form from "../../modules/presto.js";

export default class OrganicaInc extends AutocompleteHTML {
	#economica = this.form.elements["ecoInc"];

	constructor() {
		super(); // Must call super before 'this'
		this.setMinLength(4); // default initialization
		this.#economica.dataset.empty = "lblSelectEco";
	}

	select(item) { // override => final select
		api.init().json("/uae/presto/economicas/inc?org=" + item.value).then(this.#economica.setItems); // load economicas inc.
		form.setAvisoFa(item).setValue("faInc", item.int & 1); // organica afectada
		return item.value;
	}
	source() {
		const url = presto.isGcr() ? "/uae/presto/organicas/inc/gcr" : "/uae/presto/organicas/inc"; // url by type
		api.init().json(url, { ej: form.getValue("ejInc"), term: this.value }).then(this.render); // send fetch
	}

	reset() {
		this.#economica.clear(); // clear select box
		form.setValue("faInc").setValue("impInc");
		return super.reset();
	}
}
