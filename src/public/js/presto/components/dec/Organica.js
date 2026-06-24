
import api from "../../../core/components/Api.js";
import Autocomplete from "../../../core/components/forms/Autocomplete.js";
import EconomicaDec from "./Economica.js";
import presto from "../../model/Presto.js";

export default class OrganicaDec extends Autocomplete {
	connectedCallback() {
		this.setMinLength(4); // default initialization
	}

	setValue(value) {
		this.form.elements.faDec.setValue(presto.isFa()); // set indicador de organica afectada
		this.setValue(presto.get("idOrgDec"), presto.get("orgDec") + " - " + presto.get("dOrgDec"));
	}
	setEditable() {
		this.setReadonly(!presto.isEditable());
	}

	source() {
		const ej = this.form.elements.ej.value; // current ejercicio
		const opts = { 3: "/uae/presto/organicas/l83", 5: "/uae/presto/organicas/ant" };
		const url = opts[presto.getTipo()] || "/uae/presto/organicas/dec"; // default url
		api.init().json(url, { ej, term: this.value }).then(this.render);
	}
	select(item) {
		presto.isAutoLoadInc() && this.form.getPartidas().reset(); //autoload => clear table
		const url = presto.isAutoLoadInc() ? "/uae/presto/economicas/l83" : "/uae/presto/economicas/dec"; // url by type
		api.init().json(url + "?org=" + item.value).then(this.form.elements.ecoDec.reload); // reload economicas
		this.form.setAvisoFa(item).setValue("faDec", item.int & 1); // indicador de organica afectada
		return item.value;
	}

	reset() {
		presto.isAutoLoadInc() && this.form.getPartidas().reset(); //autoload => clear table
		this.form.elements.ecoDec.clear();
		this.form.elements.faDec.reset();
		return super.reset();
	}
}

customElements.define("economica-dec", EconomicaDec, { extends: "select" });
