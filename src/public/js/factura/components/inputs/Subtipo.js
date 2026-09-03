
import DataList from "../../../components/inputs/DataList.js";
import factura from "../../model/Factura.js";

export default class Subtipo extends DataList {
	setEditable() {
		this.setReadonly(!factura.isEditable());
		this.querySelectorAll(".facturable").forEach(opt => opt.classList.toggle("hide", !factura.isFacturable()));
		this.querySelectorAll(".carta-pago").forEach(opt => opt.classList.toggle("hide", !factura.isCartaPago()));
	}

	setValue(subtipo) {
		super.setValue(subtipo); // update input
		factura.setSubtipo(subtipo); // update model
		this.form.tercero.setTercero(); // reload fiscal
	}

	connectedCallback() {
		this.addChange(ev => this.setValue(+ev.target.value)); // update table
	}
}
