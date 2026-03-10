
import valid from "../i18n/validators.js";
import Fiscal from "./fiscal.js";
import Imputacion from "./imputacion.js";

import FacturaSolicitudes from "./facturas.js";
import Solicitud from "../../core/modules/solicitud.js";

class Factura extends Solicitud {
	#fiscal = new Fiscal(this);
	#imputacion = new Imputacion(this);

	init() { // init modules
		super.init(valid);
		this.#fiscal.init();
		this.#imputacion.init();
		return this;
	}

	onView(data) {
		this.#fiscal.view(data); // tercero + delegaciones + sujeto/exento + face
		this.#imputacion.view(data); // organica + recibo
	}

	getSolicitudes = () => window.solicitudes; // tabla de solicitudes
	getFiscal = () => this.#fiscal; // datos fiscales (tercero + delegacion)
	getImputacion = () => this.#imputacion; // imputacion
	getLineas = this.#imputacion.getLineas;

	setIva = iva => {
		this.getLineas().setIva(iva);
		return this;
	}
}

customElements.define("fact-table", FacturaSolicitudes, { extends: "table" });

export default new Factura();
