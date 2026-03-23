
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import api from "../../../components/Api.js";
import factura from "../../model/Factura.js";
import form from "../factura.js";

export default class Tercero extends AutocompleteHTML {
	#delegaciones = this.form.elements["delegacion"];

	constructor() {
		super(); // Must call super before 'this'
		this.setDelay(500).setMinLength(5).addListener("reset", () => this.clear());
	}

	init() {
		this.#delegaciones.setEmptyOption("Seleccione una delegación");
	}
	view(fact, delegaciones) {
		this.#delegaciones.setItems(delegaciones); // cargo las delegaciones
		return fact ? this.setValue(fact.idTer, fact.nif + " - " + fact.tercero) : this.clear();
	}

	source() { api.init().json("/uae/fact/terceros", { term: this.value }).then(this.render); }
	select(item) {
		this.setLabel(item.label); // update label before get code-nif
		api.init().json(`/uae/fact/delegaciones?ter=${item.value}`).then(this.#delegaciones.setItems);
		form.getFiscal().update(factura.getSubtipo(), item);
		return item.value;
	}

	clear() {
		super.clear();
		this.#delegaciones.clear();
	}
}
