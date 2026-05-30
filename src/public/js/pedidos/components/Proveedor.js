
import alerts from "../../components/Alerts.js";
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
		if (data.id) // datos del pedido (no contiene idProveedor)
			this.setValue(1, data.nif + " - " + data.prov);
		else
			this.clear(); // creating
	}
	setEditable() {
		this.setDisabled(!pedido.isEditable());
		this.#info.setVisible(pedido.isEditable());
	}

	source() { api.init().json("/uae/pedidos/proveedores", { term: this.value }).then(this.render); }
	row(item) { return item.prov; }
	select(item) {
		const tpl = '<div class="text-block"><b>@lblImpPagado;:</b> $getImpAplicado; €,</div><div class="text-block"><b>@lblImpComprometido;:</b> $getImpPendiente; €,</div><div class="text-block"><b>@lblImpTotal; @yyyy;:</b> $getImpAcumulado; €,</div><div class="text-block"><b>@lblMargen;:</b> $getMargen0; €</div>';
		this.#info.innerHTML = i18n.render(tpl, proveedor.setData(item));
		this.form.getElement("categoria").loadByEconomica(item.eco);
		this.form.setValue("email", item.email);

		if (proveedor.getMargen() > 0)
			this.form.closeAlerts();
		else // aviso para el margen negativo o 0
			alerts.showWarn("El proveedor seleccionado puede incumplir el margen para la ley de contratos.");
		return item.id;
	}

	reset() {
		this.#info.innerText = "";
		this.form.setValue("email");
		return super.reset();
	}

	validate() {
		if (!this.isLoaded())
			return !this.setRequired(); // required
		// validación opcional del margen para la ley de contratos
		const msg = "El proveedor seleccionado puede incumplir el margen para la ley de contratos. ¿Desea continuar?";
		const ok = (proveedor.getMargen() > 0) || window.confirm(msg);
		return ok && this.setOk();
	}
}
