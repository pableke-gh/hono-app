
import api from "../../../core/components/Api.js";
import factura from "../../model/Factura.js";
import form from "../../modules/factura.js";
import observer from "../../../core/util/Observer.js";
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";

export default class AutocompleteTTPP extends AutocompleteHTML {
	update = () => { // final arrow function
		this.parentNode.classList.toggle("hide", !factura.isTtppEmpresa());
		this.parentNode.parentNode.classList.toggle("hide", !factura.isEditable());

		const impLinea = this.parentNode.previousElementSibling;
		impLinea.classList.toggle("hide", !factura.isConceptos());
		impLinea.previousElementSibling.classList.toggle("hide", !factura.isConceptos());
	}

	setEditable() {
		this.setDisabled(!factura.isTtppEmpresa());
	}

	source() {
		const id = form.getValue("organica"); // pk de la organica required
		id && api.init().json("/uae/ttpp/recibos", { id, term: this.value }).then(this.render);
	}

	connectedCallback() {
		this.setMinLength(4); // init. component
		observer.subscribe("form-updated", this.update);
	}
}
