
import AutocompleteHTML from "../../components/inputs/AutocompleteHTML.js";
import api from "../../components/Api.js";
import i18n from "../i18n/langs.js";

import pedido from "../model/Pedido.js";
import aplicacion from "../model/Aplicacion.js";

export default class Aplicacion extends AutocompleteHTML {
	#info = this.form.querySelector("#org-info");

	connectedCallback() { // default initialization
		this.setMinLength(4);
	}

	load(data) {
		if (!data.apli || !aplicacion.getId())
			return this.clear(); // clear input
		return this.setValue(aplicacion.getId(), this.row(aplicacion.getData()));
	}
	setEditable() {
		this.setDisabled(!pedido.isEditable());
	}

	source() {
		const eco = aplicacion.get("eco") || "21200"; // economica por defecto = categoria 1
		api.init().json("/uae/pedidos/organicas", { eco, term: this.value }).then(this.render);
	}

	row(item) {
		return item.org + " - " + item.desc;
	}
	select(item) {
		const tpl = "<b>@lblDisponible;:</b> $imp; €";
		this.#info.innerHTML = i18n.render(tpl, aplicacion.load(item));
		//console.log("Aplicación:", item);
		return aplicacion.getId();
	}

	reset() {
		aplicacion.unload();
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
