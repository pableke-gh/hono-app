
import DataList from "../../../components/inputs/DataList.js";
import factura from "../../model/Factura.js";

export default class Subtipo extends DataList {
	setEditable() {
		this.setReadonly(!factura.isEditable());
	}

	setValue(subtipo) {
		super.setValue(subtipo); // update input
		factura.setSubtipo(subtipo); // update model
		this.form.elements.tercero.setTercero(); // reload fiscal
	}

	/*render() {
		this.replaceChildren(); // removes all children
		if (factura.isCartaPago()) { // subtipo de carta de pago
			this.appendChild(new Option("12", "RED DE CÁTEDRAS"));
		}
		else { // subtipo de facturas
			this.appendChild(new Option("14", "MATRÍCULAS ENSEÑANZA OFICIAL - CONVENIOS EDUCATIVOS (SUBV. PRECIO)"));
		}
	}*/

	connectedCallback() {
		this.addChange(ev => this.setValue(+ev.target.value)); // update table
	}
}
