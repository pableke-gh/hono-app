
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import api from "../../../core/components/Api.js";
import factura from "../../model/Factura.js";
import tercero from "../../model/Tercero.js";
import form from "../../modules/factura.js";
import fiscalidad from "../../data/fiscal.js"

// Item list: value = id tercero / label = nif - nombre
export default class Tercero extends AutocompleteHTML {
	load(data) {
		this.setValue(data.idTer, data.nif + " - " + data.tercero); // autocomplete
		this.form.elements.delegacion.setOption(data.delegacion, data.delName); // data-list
		factura.setSujeto(data.sujeto).setFace(data.face); // sujeto / exento + face
	}
	setEditable() {
		this.setReadonly(!factura.isEditable());
	}

	source() {
		api.init().json("/uae/fact/terceros", { term: this.value }).then(this.render);
	}
	select(item) {
		const fnItems = items => this.form.elements.delegacion.setItems(items);
		api.init().json(`/uae/fact/delegaciones?ter=${item.value}`).then(fnItems);
		this.setSubtipo(factura.getSubtipo());
		return item.value;
	}

	reset() {
		this.form.elements.delegacion.clear();
		return super.reset();
	}

	#fiscalidad(data) {
		if (factura.isCartaPago()) // no es facturable
			return fiscalidad.getCartaPago(factura.getSubtipo());
		if (factura.isTtppEmpresa())
			return fiscalidad.getTtppEmpresa(); // TTPP a empresa
		return fiscalidad.get(tercero.getKeyFiscal(data), factura.getSubtipo()); // complete key
	}
	setTercero(tercero) { // actualizo la fiscalidad
		if (!tercero) return; // nada que modificar
		const data = this.#fiscalidad(tercero); // new data
		form.setData(data, ".ui-fiscal").setIva(data.iva); // update fields + iva
		factura.setSujeto(data.sujeto);
	}

	setSubtipo(subtipo) {
		factura.setSubtipo(subtipo).setNifTercero(this.getCode());
		this.setTercero(this.getCurrent());
		form.refresh(factura); // force refresh view
	}

	connectedCallback() {
		this.setDelay(500).setMinLength(5);
	}
}
