
import DataList from "../../../components/inputs/DataList.js";
import factura from "../../model/Factura.js";

export default class Exento extends DataList {
	setEditable() {
		const isFactUae = factura.isUae() && factura.isFacturable(); // uae visible fields
		this.parentNode.parentNode.classList.toggle("hide", !isFactUae); // grupo fiscal

		this.setVisible(factura.isExento());
		this.setReadonly(!factura.isEditableUae());
	}
}
