
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import Organicas from "../tables/organicas.js";

export default class Organica extends AutocompleteHTML {
	#organicas = tabs.getTab(0).querySelector("table");

	constructor() {
		super(); // Must call super before 'this'
		this.setMinLength(4).addListener("reset", this.#organicas.autoreset);
	}

	source = () => api.init().json("/uae/iris/organicas", { term: this.value }).then(this.render);
	row = organica => (organica.o + " - " + organica.dOrg);
	select = organica => { this.#organicas.autoload(organica); return organica.id; }
	isLoaded() { return super.isLoaded() || this.#organicas.size(); }
	validate = () => (this.isLoaded() ? this.setOk() : !this.setRequired("errOrganicas"));

	setValue(organica) {
		return (organica ? super.setValue(organica.id, this.row(organica)) : super.clear());
	}
	setOrganicas(organicas) {
		this.#organicas.render(organicas);
		this.setValue(this.#organicas.getFirst());
	}

	clear() {
		super.clear();
		this.#organicas.reset();
	}

	getOrganicas = () => this.#organicas;
	getFinanciacion = this.#organicas.getFinanciacion;

	connectedCallback() {
		super.connectedCallback();
		tabs.setAction("addOrganica", () => {
			const current = this.getItem();
			current ? this.#organicas.push(current) : this.reload(); // new organica
			super.clear(); // remove selected
		});
	}
}

customElements.define("organica-table", Organicas, { extends: "table" });
