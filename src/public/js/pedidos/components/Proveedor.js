
import i18n from "../i18n/langs.js";
import api from "../../core/components/Api.js";
import alerts from "../../core/components/helper/Alerts.js";

import pedido from "../model/Pedido.js";
import proveedor from "../model/Proveedor.js";

import Autocomplete from "../../core/components/forms/Autocomplete.js";

export default class Proveedor extends Autocomplete {
	#info = this.form.querySelector("#prov-info");

	connectedCallback() { // default initialization
		this.setMinLength(5); // default initialization
	}

	setValue(value) {
		if (pedido.getId()) // datos del pedido (no contiene idProveedor)
			super.setValue(1, pedido.getNifNameProv()); // nif + nombre del proveedor
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
			alerts.setWarn("El proveedor seleccionado puede incumplir el margen para la ley de contratos.");
		return item.id;
	}

	reset() {
		this.#info.innerText = "";
		this.form.setValue("email");
		return super.reset();
	}

	validate() {
		if (!this.isLoaded())
			return this.setRequired(); // required
		// validación opcional del margen para la ley de contratos
		const msg = "El proveedor seleccionado puede incumplir el margen para la ley de contratos. ¿Desea continuar?";
		const ok = (proveedor.getMargen() > 0) || window.confirm(msg);
		return ok && !this.setOk();
	}
}
