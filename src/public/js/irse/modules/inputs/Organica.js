
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import observer from "../../../core/util/Observer.js";

import irse from "../../model/Irse.js";
import Organicas from "../tables/organicas.js";

export default class Organica extends AutocompleteHTML {
	#organicas = tabs.$1(0, "table");

	connectedCallback() {
		this.setMinLength(4); // Initialize element after form
		observer.subscribe("perfil", () => { // pdi show autocomplete + hide button
			const label = this.parentNode.parentNode; // element container
			label.children[3].render(irse); // importe de crédito vinculante
			label.setVisible(irse.isUxxiec() ? !this.isLoaded() : label.children[2].hide());
		});
		tabs.setAction("addOrganica", () => {
			const current = this.getItem();
			current ? this.#organicas.push(current) : this.reload(); // new organica
			super.reset().setLabel(); // clear autocomplete => data in table
		});
	}

	source() { api.init().json("/uae/iris/organicas", { term: this.value }).then(this.render); }
	row(organica) { return (organica.o + " - " + organica.dOrg); }
	select(organica) { this.#organicas.autoload(organica); return organica.id; }

	setEditable() { this.setDisabled(!irse.isEditableP0()); }
	isLoaded() { return super.isLoaded() || this.#organicas.size(); }
	validate = () => (this.isLoaded() ? this.setOk() : !this.setRequired("errOrganicas"));

	setOrganica(organica) {
		return (organica ? super.setValue(organica.id, this.row(organica)) : this.clear());
	}
	setOrganicas(organicas) {
		this.setOrganica(organicas && organicas[0]);
		this.#organicas.render(organicas);
	}

	reset() {
		if (this.#organicas.size())
			this.#organicas.reset();
		return super.reset();
	}

	getOrganicas = () => this.#organicas;
	getFinanciacion = this.#organicas.getFinanciacion;
}

customElements.define("organica-table", Organicas, { extends: "table" });
