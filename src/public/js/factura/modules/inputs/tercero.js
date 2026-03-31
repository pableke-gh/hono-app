
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import api from "../../../components/Api.js";
import factura from "../../model/Factura.js";
import form from "../factura.js";

// Item list: value = id tercero / label = nif - nombre
export default class Tercero extends AutocompleteHTML {
	#delegaciones = this.form.elements["delegacion"];

	constructor() {
		super(); // Must call super before 'this'
		this.setDelay(500).setMinLength(5).addListener("reset", () => this.clear());
	}

	load(data) {
		this.setValue(data.idTer, data.nif + " - " + data.tercero); // autocomplete
		this.#delegaciones.setOption(data.delegacion, data.delName); // data-list
	}

	source() { api.init().json("/uae/fact/terceros", { term: this.value }).then(this.render); }
	select(item) {
		api.init().json(`/uae/fact/delegaciones?ter=${item.value}`).then(this.#delegaciones.setItems);
		form.getFiscal().update(factura.getSubtipo());
		return item.value;
	}

	clear() {
		super.clear();
		this.#delegaciones.clear();
	}
}
