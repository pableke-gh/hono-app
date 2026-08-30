
import DataList from "../../../components/inputs/DataList.js";
import factura from "../../model/Factura.js";
import tables from "../tables/tables.js";

export default class IVA extends DataList {
	setEditable() {
		this.form.elements.m349.setReadonly(!factura.isEditableUae());
		this.form.elements.iban.setReadonly(!factura.isEditableUae());
		this.setReadonly(!factura.isEditableUae());
	}

	setValue(iva) {
		super.setValue(iva);
		factura.setIva(iva);
		tables.get("lineas").afterRender().reloadFooter();
	}

	setFiscal(data) {
		this.form.elements.sujeto.setValue(data.sujeto);
		this.form.elements.exento.setValue(data.exento);
		this.form.elements.m349.setValue(data.m349);
		this.form.elements.idEco.setEconomica(data.economica);
		this.form.elements.iban.setValue(data.iban);
		this.setValue(data.iva);
	}

	connectedCallback() {
		this.addChange(ev => this.setValue(+ev.target.value)); // update table
	}
}
