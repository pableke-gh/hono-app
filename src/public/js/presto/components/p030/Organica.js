
import Autocomplete from "../../../core/components/forms/Autocomplete.js";
import api from "../../../core/components/Api.js";
import presto from "../../model/Presto.js";

export default class Organica030 extends Autocomplete {
	connectedCallback() {
		this.setMinLength(4); // default initialization
	}

	setValue(value) {
		this.setValue(presto.get("org030"), presto.get("o030") + " - " + presto.get("dOrg030"));
	}

	setEditable() { this.setReadonly(!presto.isEditableUae()); }
	toFormData(fd) {} // not append values in form data

	source() {
		const ej = this.form.elements.ej030.value; // current ejercicio
		api.init().json("/uae/presto/organicas/030", { ej, term: this.value }).then(this.render);
	}

	select(item) {
		this.form.setValue("eco030", item.imp);
		return item.value;
	}
}
