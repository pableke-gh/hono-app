
import valid from "../i18n/validators.js";
import Fiscal from "./fiscal.js";
import Imputacion from "./imputacion.js";
import facturas from "./facturas.js";
import Solicitud from "../../core/modules/solicitud.js";

class Factura extends Solicitud {
	#fiscal = new Fiscal(this);
	#imputacion = new Imputacion(this);

	constructor() {
		super(facturas, facturas.getSolicitud());
	}

	init() { // init modules
		this.setValidators(valid);
		this.#fiscal.init();
		this.#imputacion.init();
		return super.init();
	}

	onView(data) {
		this.#fiscal.view(data); // tercero + delegaciones + sujeto/exento + face
		this.#imputacion.view(data); // organica + recibo
	}

	getFiscal = () => this.#fiscal;
	getImputacion = () => this.#imputacion;
	getLineas = this.#imputacion.getLineas;

	setIva = iva => {
		this.#imputacion.getLineas().setIva(iva);
		return this;
	}
}

export default new Factura();
