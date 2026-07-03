
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import api from "../../../components/Api.js";

import EconomicaDec from "./Economica.js";
import presto from "../../model/Presto.js";
import form from "../../modules/presto.js";

export default class OrganicaDec extends AutocompleteHTML {
	connectedCallback() {
		this.setMinLength(4); // default initialization
	}

	load(data) {
		this.setValue(data.idOrgDec, data.orgDec + " - " + data.dOrgDec);
		this.form.elements.faDec.setValue(presto.isFa()); // set indicador de organica afectada
	}
	setEditable() { return this.setReadonly(!presto.isEditable()); }

	source() {
		const opts = { 3: "/uae/presto/organicas/l83", 5: "/uae/presto/organicas/ant" };
		const url = opts[presto.getTipo()] || "/uae/presto/organicas/dec"; // default url
		api.init().json(url, { ej: form.getValue("ej"), term: this.value }).then(this.render);
	}
	select(item) {
		presto.isAutoLoadInc() && form.getPartidas().reset(); //autoload => clear table
		const url = presto.isAutoLoadInc() ? "/uae/presto/economicas/l83" : "/uae/presto/economicas/dec"; // url by type
		api.init().json(url + "?org=" + item.value).then(this.form.elements.ecoDec.reload); // reload economicas
		form.setAvisoFa(item).setValue("faDec", item.int & 1); // indicador de organica afectada
		return item.value;
	}

	reset() {
		presto.isAutoLoadInc() && form.getPartidas().reset(); //autoload => clear table
		this.form.elements.ecoDec.clear();
		this.form.elements.faDec.reset();
		return super.reset();
	}
}

customElements.define("economica-dec", EconomicaDec, { extends: "select" });
