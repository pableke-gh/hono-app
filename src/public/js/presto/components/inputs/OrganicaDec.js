
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import api from "../../../components/Api.js";

import EconomicaDec from "./EconomicaDec.js";
import presto from "../../model/Presto.js";
import form from "../../modules/presto.js";

export default class OrganicaDec extends AutocompleteHTML {
	#economica = this.form.elements["ecoDec"];

	constructor() {
		super(); // Must call super before 'this'
		this.setMinLength(4); // default initialization
	}

	load(data) {
		this.setValue(data.idOrgDec, data.orgDec + " - " + data.dOrgDec);
	}

	source() {
		const opts = { 3: "/uae/presto/organicas/l83", 5: "/uae/presto/organicas/ant" };
		const url = opts[presto.getTipo()] || "/uae/presto/organicas/dec"; // default url
		api.init().json(url, { ej: form.getValue("ej"), term: this.value }).then(this.render);
	}
	select(item) {
		presto.isAutoLoadInc() && form.getPartidas().reset(); //autoload => clear table
		const url = presto.isAutoLoadInc() ? "/uae/presto/economicas/l83" : "/uae/presto/economicas/dec"; // url by type
		api.init().json(url + "?org=" + item.value).then(this.#economica.reload); // reload economicas
		form.setAvisoFa(item).setValue("faDec", item.int & 1); // indicador de organica afectada
		return item.value;
	}

	reset() {
		presto.isAutoLoadInc() && form.getPartidas().reset(); //autoload => clear table
		this.#economica.clear();
		form.setValue("faDec");
		return super.reset();
	}
}

customElements.define("economica-dec", EconomicaDec, { extends: "select" });
