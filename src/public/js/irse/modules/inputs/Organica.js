
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";

import irse from "../../model/Irse.js";
import Organicas from "../tables/organicas.js";
import form from "../irse.js";

export default class Organica extends AutocompleteHTML {
	#organicas = tabs.getTab(0).querySelector("table");

	init() {
		this.setMinLength(4); // Initialize element after form
		const fnPDI = el => { el.show(); el.children[2].hide(); } // show autocomplete + hide add button
		form.set("update-organica", el => (irse.isUxxiec() ? el.setVisible(!this.isLoaded()) : fnPDI(el)));

		tabs.setAction("addOrganica", () => {
			const current = this.getItem();
			current ? this.#organicas.push(current) : this.reload(); // new organica
			super.reset().setLabel(); // clear autocomplete => data in table
		});
	}

	source() { api.init().json("/uae/iris/organicas", { term: this.value }).then(this.render); }
	row(organica) { return (organica.o + " - " + organica.dOrg); }
	select(organica) { this.#organicas.autoload(organica); return organica.id; }
	isLoaded() { return super.isLoaded() || this.#organicas.size(); }
	validate = () => (this.isLoaded() ? this.setOk() : !this.setRequired("errOrganicas"));

	setValue(organica) {
		return (organica ? super.setValue(organica.id, this.row(organica)) : super.clear());
	}
	setOrganicas(organicas) {
		this.#organicas.render(organicas);
		this.setValue(this.#organicas.getFirst());
	}

	reset() {
		this.#organicas.reset();
		return super.reset();
	}

	getOrganicas = () => this.#organicas;
	getFinanciacion = this.#organicas.getFinanciacion;
}

customElements.define("organica-table", Organicas, { extends: "table" });
