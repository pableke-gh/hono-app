
import AutocompleteHTML from "../../components/inputs/AutocompleteHTML.js";
import api from "../../components/Api.js";
import i18n from "../i18n/langs.js";
import pedido from "../model/Pedido.js";

export default class Aplicacion extends AutocompleteHTML {
	#categoria = this.form.elements["categoria"];
	#info = this.form.querySelector("#org-info");

	connectedCallback() { // default initialization
		this.setMinLength(4);
	}

	setEditable() {
		this.setDisabled(!pedido.isEditable());
		this.#info.setVisible(pedido.isEditable());
	}

	source() {
		const eco = this.#categoria.getEconomica(); // calculated value
		api.init().json("/uae/pedidos/organicas", { eco, term: this.value }).then(this.render);
	}

	row(item) {
		return item.org + " - " + item.desc;
	}
	select(item) {
		item.imp = item.imp || 0;
		const tpl = "@ej; @org; @func; @eco; (@lblCreditoDisp;: $imp; €)";
		this.#info.innerText = i18n.render(tpl, item);
		return item.id;
	}

	reset() {
		this.#info.innerText = "";
		return super.reset();
	}

	validate() {
		return this.isLoaded() ? this.setOk() : !this.setRequired();
	}
}
