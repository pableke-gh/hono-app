
import fiscal from "./fiscal.js";
import imputacion from "./imputacion.js";
import lineas from "./lineas.js";
import facturas from "./facturas.js";
import Solicitud from "../../core/modules/solicitud.js";

class Factura extends Solicitud {
	constructor() {
		super(facturas, facturas.getSolicitud());
	}

	getFiscal = () => fiscal;
	getImputacion = () => imputacion;
	getLineas = () => lineas;

	onView(data) {
		fiscal.view(data); // tercero + delegaciones +  sujeto/exento + face
		imputacion.view(data); // organica + recibo
		lineas.render(data.lineas); // render table
	}
}

export default new Factura();
