
import AutocompleteHTML from "../../components/inputs/AutocompleteHTML.js";
import api from "../../components/Api.js";
import i18n from "../i18n/langs.js";

import pedido from "../model/Pedido.js";
import aplicacion from "../model/Aplicacion.js";

export default class Aplicacion extends AutocompleteHTML {
	#categoria = this.form.elements["categoria"];
	#info = this.form.querySelector("#org-info");

	connectedCallback() { // default initialization
		this.setMinLength(4);
	}

	load(data) {
		if (aplicacion.isEmpty())
			return this.clear();
		const eco = this.#categoria.getEconomica(); // calculated value
		const tpl = "@ej; @org; @func; @getEconomica;"; // plantilla sin importe
		this.#info.innerText = i18n.render(tpl, aplicacion.setEconomica(eco));
		this.setValue(aplicacion.getId(), this.row(aplicacion.getData()));
	}
	setEditable() {
		this.setDisabled(!pedido.isEditable());
	}

	source() {
		const eco = this.#categoria.getEconomica(); // calculated value
		api.init().json("/uae/pedidos/organicas", { eco, term: this.value }).then(this.render);
	}

	row(item) {
		return item.org + " - " + item.desc;
	}
	select(item) {
		item.imp = item.imp || 0; // siempre muestro un importe
		const tpl = "@ej; @org; @func; @getEconomica; (@lblCreditoDisp;: $imp; €)";
		this.#info.innerText = i18n.render(tpl, aplicacion.setData(item));
		return item.id;
	}

	reset() {
		this.#info.innerText = "";
		return super.reset();
	}

	validate() { // executed after impPpto.validate
		const ok = this.isLoaded() ? this.setOk() : !this.setRequired();
		if (ok && (pedido.getImpPpto() > aplicacion.getCreditoDisp())) // validación de crédito suficiente
			return !this.form.setError("imp", "errExceeded", "No hay crédito suficiente en la aplicación presupuestaria seleccionada");
		return ok;
	}
	addFormData(fd) {
		super.addFormData(fd); // aplicacion = id
		fd.set("ej", aplicacion.getEjercicio()).set("org", aplicacion.getOrganica()).set("func", aplicacion.getFuncional());
	}
}
