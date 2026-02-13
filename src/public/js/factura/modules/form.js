
import Form from "../../components/forms/Form.js";
import factura from "../model/Factura.js";
import lineas from "./lineas.js";

// partials forms
export default class FacturaForm extends Form {
	constructor() { super("#xeco-model"); }

	setIva = iva => {
		factura.setIva(iva); // set new iva value
		lineas.afterRender().refreshFooter(); // actualizo los totales de la subtabla de conceptos
		return this;
	}
}
