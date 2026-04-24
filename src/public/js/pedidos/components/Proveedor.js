
import AutocompleteHTML from "../../components/inputs/AutocompleteHTML.js";
import api from "../../components/Api.js";
import i18n from "../i18n/langs.js";

import pedido from "../model/Pedido.js";
import proveedor from "../model/Proveedor.js";

export default class Proveedor extends AutocompleteHTML {
	#info = this.form.querySelector("#prov-info");

	connectedCallback() { // default initialization
		this.setMinLength(5); // default initialization
	}

	load(data) {
		this.setValue(1, data.nif + " - " + data.prov);
	}
	setEditable() {
		this.setDisabled(!pedido.isEditable());
		this.#info.setVisible(pedido.isEditable());
	}

	source() { api.init().json("/uae/pedidos/proveedores", { term: this.value }).then(this.render); }
	row(item) { return item.prov; }
	select(item) {
		const tpl = "@lblImpAplicado;: $getImpAplicado; €, @lblImpPendiente;: $getImpPendiente; €, @lblImpAcumulado;: $getImpAcumulado; €, Margen: $getUmbral; €";
		this.#info.innerText = i18n.render(tpl, proveedor.setData(item));
		this.form.setValue("email", item.email);
		return item.id;
	}

	reset() {
		this.#info.innerText = "";
		this.form.setValue("email");
		return super.reset();
	}

	validate() {
		return this.isLoaded() ? this.setOk() : !this.setRequired();
	}
}
