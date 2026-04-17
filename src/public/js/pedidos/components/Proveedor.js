
import AutocompleteHTML from "../../components/inputs/AutocompleteHTML.js";
import api from "../../components/Api.js";

export default class Proveedor extends AutocompleteHTML {
	connectedCallback() { // default initialization
		this.setMinLength(5); // default initialization
	}

	//load(data) { this.setValue(data.idOrg030, data.o030 + " - " + data.dOrg030); }
	source() { api.init().json("/uae/pedidos/proveedores", { term: this.value }).then(this.render); }
	row(item) { return item.prov; }
	select(item) {
		this.form.setValue("email", item.email);
		return item.id;
	}

	reset() {
		this.form.setValue("email");
		return super.reset();
	}

	validate() {
		return this.isLoaded() ? this.setOk() : !this.setRequired();
	}
}
