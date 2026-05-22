
import api from "../../../components/Api.js";
import factura from "../../model/Factura.js";
import form from "../../modules/factura.js";
import observer from "../../../core/util/Observer.js";
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";

export default class AutocompleteTTPP extends AutocompleteHTML {
	setEditable() {
		this.parentNode.setVisible(factura.isTtppEmpresa());
		this.setDisabled(!factura.isTtppEmpresa());
	}

	source() {
		const id = form.getValue("organica"); // pk de la organica required
		id && api.init().json("/uae/ttpp/recibos", { id, term: this.value }).then(this.render);
	}

	connectedCallback() {
		this.setMinLength(4); // init. component
		observer.subscribe("form-update", () => this.setEditable()); // update button state on pedido changes
	}
}
