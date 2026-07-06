
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import api from "../../../components/Api.js";
import factura from "../../model/Factura.js";
import form from "../../modules/factura.js";

// Item list: value = id tercero / label = nif - nombre
export default class Tercero extends AutocompleteHTML {
	connectedCallback() {
		this.setDelay(500).setMinLength(5);
	}

	load(data) {
		this.setValue(data.idTer, data.nif + " - " + data.tercero); // autocomplete
		this.form.elements.delegacion.setOption(data.delegacion, data.delName); // data-list
	}

	source() { api.init().json("/uae/fact/terceros", { term: this.value }).then(this.render); }
	select(item) {
		const fnItems = items => this.form.elements.delegacion.setItems(items);
		api.init().json(`/uae/fact/delegaciones?ter=${item.value}`).then(fnItems);
		form.getFiscal().update(factura.getSubtipo());
		return item.value;
	}

	reset() {
		this.form.elements.delegacion.clear();
		return super.reset();
	}
}
