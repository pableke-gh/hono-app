
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import tabs from "../../../core/components/tabs/TabsOld.js";
import api from "../../../core/components/Api.js";
import observer from "../../../core/util/Observer.js";
import irse from "../../model/Irse.js";
import tables from "../tables/tables.js";

export default class Organica extends AutocompleteHTML {
	connectedCallback() {
		this.setMinLength(4); // Initialize element after form
		observer.subscribe("perfil", () => { // pdi show autocomplete + hide button
			const label = this.parentNode.parentNode; // element container
			label.children[3].render(irse); // importe de crédito vinculante
			label.setVisible(irse.isUxxiec() ? !this.isLoaded() : label.children[2].hide());
		});
		tabs.setAction("addOrganica", () => {
			const current = this.getItem();
			current ? this.getOrganicas().push(current) : this.reload(); // new organica
			super.reset().setLabel(); // clear autocomplete => data in table
		});
	}

	load() { return this; } // not to load on view
	source() { api.init().json("/uae/iris/organicas", { term: this.value }).then(this.render); }
	row(organica) { return (organica.o + " - " + organica.dOrg); }
	select(organica) { this.getOrganicas().autoload(organica); return organica.id; }

	getOrganicas = () => tables.get("organicas");
	setEditable() { this.setDisabled(!irse.isEditableP0()); }
	isLoaded() { return super.isLoaded() || this.getOrganicas().size(); }
	validate = () => (this.isLoaded() ? this.setOk() : !this.setRequired("errOrganicas"));

	setOrganica(organica) {
		return (organica ? super.setValue(organica.id, this.row(organica)) : this.clear());
	}
	setOrganicas(organicas) {
		this.setOrganica(organicas && organicas[0]);
		this.getOrganicas().render(organicas);
	}

	reset() {
		const organicas = this.getOrganicas();
		organicas.size() && organicas.reset();
		return super.reset();
	}
}
