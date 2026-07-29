
import api from "../../../core/components/Api.js";
import factura from "../../model/Factura.js";
import form from "../../modules/factura.js";
import observer from "../../../core/util/Observer.js";
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";

export default class AutocompleteTTPP extends AutocompleteHTML {
	update = () => { // final arrow function
		this.setVisible(factura.isTtppEmpresa());
		this.parentNode.parentNode.classList.toggle("hide", !factura.isEditable());
		this.form.elements.desc.setVisible(factura.isConceptos());
		this.form.elements.imp.setVisible(factura.isConceptos());
	}

	setEditable() {
		this.setDisabled(!factura.isEditable());
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
