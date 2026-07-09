
import api from "../../../core/components/Api.js";
import presto from "../../model/Presto.js";
import form from "../../modules/presto.js";

import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import Economica030 from "./Economica.js";
import Save030 from "./Save030.js";

export default class Organica030 extends AutocompleteHTML {
	connectedCallback() {
		this.setMinLength(4); // default initialization
	}

	load(data) { this.setValue(data.org030, data.o030 + " - " + data.dOrg030); }
	setEditable() { return this.setReadonly(!presto.isEditableUae()); }
	addFormData(fd) {} // not append values in form data

	source() { api.init().json("/uae/presto/organicas/030", { ej: form.getValue("ej030"), term: this.value }).then(this.render); }
	select(item) { form.setValue("eco030", item.imp); return item.value; }
}

customElements.define("economica-030", Economica030, { extends: "select" });
customElements.define("save-030", Save030, { extends: "button" });
