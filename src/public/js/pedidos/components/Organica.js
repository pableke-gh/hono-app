
import AutocompleteHTML from "../../components/inputs/AutocompleteHTML.js";
import api from "../../components/Api.js";
import i18n from "../i18n/langs.js";
import pedido from "../model/Pedido.js";

export default class Organica extends AutocompleteHTML {
	#categoria = this.form.elements["categoria"];
	#info = this.form.querySelector("#org-info");

	connectedCallback() { // default initialization
		this.setMinLength(4);
	}

	//load(data) { this.setValue(data.idOrg030, data.o030 + " - " + data.dOrg030); }
	setEditable() { this.setDisabled(!pedido.isEditable()); }

	source() {
		const eco = this.#categoria.getEconomica(); // calculated value
		api.init().json("/uae/pedidos/organicas", { eco, term: this.value }).then(this.render);
	}

	row(item) {
		return item.org + " - " + item.desc;
	}
	select(item) {
		const tpl = "@ej; @org; @func; @eco; ($imp; €)";
		this.#info.setText(i18n.render(tpl, item));
		return item.id;
	}

	reset() {
		this.#info.setText("");
		return super.reset();
	}

	validate() {
		return this.isLoaded() ? this.setOk() : !this.setRequired();
	}
}
