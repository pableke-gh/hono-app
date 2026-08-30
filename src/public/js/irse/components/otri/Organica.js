
import AutocompleteHTML from "../../../core/components/forms/Autocomplete.js";
import tabs from "../../../core/components/tabs/Tabs.js";
import api from "../../../core/components/Api.js";
import observer from "../../../core/util/Observer.js";
import irse from "../../model/Irse.js";
import tables from "../tables/tables.js";

export default class Organica extends AutocompleteHTML {
	/* deprecated functions, preserve for old compatibility */
	load(data) {} // deprecated: old compatibility
	prepare(model) { this.setEditable(); this.load(model.getData()); } // deprecated: old compatibility
	update(tip, msg) { return tip ? this.setError(tip, msg) : !this.setOk(); } // deprecated: old compatibility
	/* deprecated functions, preserve for old compatibility */

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
