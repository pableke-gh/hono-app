
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import api from "../../../components/Api.js";
import factura from "../../model/Factura.js";
import form from "../factura.js";

export default class Tercero extends AutocompleteHTML {
	#delegaciones = this.form.elements["delegacion"];

	constructor() {
		super(); // Must call super before 'this'
		this.setDelay(500).setMinLength(5)
			.addListener("afterSelect", this.#afterSelect)
			.addListener("reset", () => this.clear());
	}

	init() {
		this.#delegaciones.setEmptyOption("Seleccione una delegación");
	}
	view(fact, delegaciones) {
		this.#delegaciones.setItems(delegaciones); // cargo las delegaciones
		return fact ? this.setValue(fact.idTer, fact.nif + " - " + fact.tercero) : this.clear();
	}

	source = () => api.init().json("/uae/fact/terceros", { term: this.value }).then(this.render);
	#afterSelect() {
		const tercero = this.getCurrent(); // current item selected
		api.init().json(`/uae/fact/delegaciones?ter=${tercero.value}`).then(this.#delegaciones.setItems);
		form.getFiscal().update(factura.getSubtipo(), tercero);
	}

	clear() {
		super.clear();
		this.#delegaciones.clear();
	}
}
