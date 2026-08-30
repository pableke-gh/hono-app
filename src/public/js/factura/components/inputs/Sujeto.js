
import DataList from "../../../components/inputs/DataList.js";
import factura from "../../model/Factura.js";

export default class Sujeto extends DataList {
	setEditable() {
		this.setReadonly(!factura.isEditableUae());
	}

	setValue(sujeto) {
		super.setValue(sujeto);
		factura.setSujeto(sujeto);
		this.form.elements.exento.setEditable();
	}

	connectedCallback() {
		this.addChange(ev => { this.setValue(+ev.target.value); this.refresh(factura); })
	}
}
