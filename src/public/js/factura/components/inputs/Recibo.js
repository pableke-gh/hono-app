
import api from "../../../core/components/Api.js";
import observer from "../../../core/util/Observer.js";

import factura from "../../model/Factura.js";
import form from "../../modules/factura.js";
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";

export default class Recibo extends AutocompleteHTML {
	load(data) {
		this.setValue(data.recibo, data.acRecibo);
	}

	setEditable() {
		this.setVisible(factura.isRecibo());
		this.setReadonly(!factura.isEditable());
	}

	source() {
		const id = form.getValue("organica") || 0; // pk de la organica optional
		const url = factura.isExtension() ? "/uae/fact/recibos/tpv" : "/uae/fact/recibos/ac";
		api.init().json(url, { id, term: this.value }).then(this.render);
	}

	connectedCallback() {
		this.setMinLength(4); // init. component
		observer.subscribe("solicitud", () => this.setEditable()); // update fiscal inputs state
	}
}
