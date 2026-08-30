
import Autocomplete from "../../../core/components/forms/Autocomplete.js";
import api from "../../../core/components/Api.js";
import factura from "../../model/Factura.js";
import tercero from "../../model/Tercero.js";
import form from "../../modules/factura.js";

// Item list: value = id tercero / label = nif - nombre
export default class Tercero extends Autocomplete {
	setEditable() {
		this.setReadonly(!factura.isEditable());
	}

	/* deprecated functions, preserve for old compatibility */
	load(data) { // deprecated: old compatibility
		this.setValue(data.idTer, data.nif + " - " + data.tercero); // autocomplete
		this.form.elements.delegacion.setOption(data.delegacion, data.delName); // data-list
		factura.setSujeto(data.sujeto).setFace(data.face); // sujeto / exento + face
	}
	prepare(model) { this.setEditable(); this.load(model.getData()); } // deprecated: old compatibility
	update(tip, msg) { return tip ? this.setError(tip, msg) : !this.setOk(); } // deprecated: old compatibility
	/* deprecated functions, preserve for old compatibility */

	toData(data) {
		super.toData(data);
		data.nif = this.getCode();
	}

	source() {
		api.init().json("/uae/fact/terceros", { term: this.value }).then(this.render);
	}
	select(item) {
		const fnItems = items => this.form.elements.delegacion.setItems(items);
		api.init().json(`/uae/fact/delegaciones?ter=${item.value}`).then(fnItems);
		this.setTercero(item); // actualiza el terceros
		return item.value;
	}

	reset() {
		this.form.elements.delegacion.clear();
		return super.reset();
	}

	setTercero(data) {
		data = data || this.getCurrent();
		if (data) // actualizo la fiscalidad si hay tercero
			this.form.elements.iva.setFiscal(tercero.getFiscal(data));
		form.refresh(factura); // force refresh view
	}

	connectedCallback() { // init. component
		this.setDelay(500).setMinLength(5);
	}
}
