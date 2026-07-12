
import api from "../../components/Api.js";
import AutocompleteHTML from "../../components/forms/Autocomplete.js";

export default class AutocompleteUxxiec extends AutocompleteHTML {
	connectedCallback() {
		this.setMinLength(4); // default initialization
	}

	setEditable() {
		this.setReadonly(false);
	}

	source() {
		const ej = this.form.elements.ej.value; // selected ej
		const url = this.form.getAttribute("action") + "/uxxiec/docs";
		api.init().json(url, { ej, term: this.value }).then(this.render)
	}
	row(item) { return item.num + " - " + item.uxxi + "<br>" + item.desc; }
	select(item) { return item.id; }
}
