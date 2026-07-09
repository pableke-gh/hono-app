
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import api from "../../../core/components/Api.js";

import factura from "../../model/Factura.js";
import form from "../../modules/factura.js";

export default class Recibo extends AutocompleteHTML {
	constructor() {
		super(); // Must call super before 'this'
		this.setMinLength(4); // init. component
	}

	load(data) { this.setValue(data.recibo, data.acRecibo); }
	setEditable() { this.setReadonly(!factura.isEditable()); }

	source() {
		const id = form.getValue("organica") || 0; // pk de la organica optional
		const url = factura.isExtension() ? "/uae/fact/recibos/tpv" : "/uae/fact/recibos/ac";
		api.init().json(url, { id, term: this.value }).then(this.render);
	}
}
