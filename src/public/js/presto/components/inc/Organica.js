
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import api from "../../../core/components/Api.js";

import presto from "../../model/Presto.js";
import form from "../../modules/presto.js";
import EconomicaInc from "./Economica.js";

export default class OrganicaInc extends AutocompleteHTML {
	addFormData(fd) {} // not append values in form data
	setEditable() { return this; } // preserve state always editable

	connectedCallback() {
		this.setMinLength(4); // default initialization
		this.form.elements.ejInc.addEventListener("change", this.reload);
	}

	select(item) { // override => final select
		const fnItems = items => this.form.elements.ecoInc.setItems(items);
		api.init().json("/uae/presto/economicas/inc?org=" + item.value).then(fnItems); // load economicas inc.
		form.setAvisoFa(item).setValue("faInc", item.int & 1); // organica afectada
		return item.value;
	}
	source() {
		const url = presto.isGcr() ? "/uae/presto/organicas/inc/gcr" : "/uae/presto/organicas/inc"; // url by type
		api.init().json(url, { ej: form.getValue("ejInc"), term: this.value }).then(this.render); // send fetch
	}

	reset() {
		this.form.elements.ecoInc.clear(); // clear select box
		form.setValue("faInc").setValue("impInc");
		return super.reset();
	}
}

customElements.define("economica-inc", EconomicaInc, { extends: "select" });
