
import valid from "../i18n/validators.js";
import Fiscal from "./fiscal.js";
import Imputacion from "./imputacion.js";
import Facturas from "./facturas.js";
import Solicitud from "../../core/modules/solicitud.js";

class Factura extends Solicitud {
	#facturas = new Facturas();
	#fiscal = new Fiscal(this);
	#imputacion = new Imputacion(this);

	init() { // init modules
		super.init(this.#facturas, valid);
		this.#facturas.init();

		this.#fiscal.init();
		this.#imputacion.init();
		return this;
	}

	onView(data) {
		this.#fiscal.view(data); // tercero + delegaciones + sujeto/exento + face
		this.#imputacion.view(data); // organica + recibo
	}

	getSolicitudes = () => this.#facturas; // list
	getFiscal = () => this.#fiscal;
	getImputacion = () => this.#imputacion;
	getLineas = this.#imputacion.getLineas;

	setIva = iva => {
		this.#imputacion.getLineas().setIva(iva);
		return this;
	}
}

export default new Factura();
