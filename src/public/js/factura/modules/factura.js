
import sb from "../../components/types/StringBox.js";
import valid from "../i18n/validators.js";

import factura from "../model/Factura.js";
import Fiscal from "./fiscal.js";
import Imputacion from "./imputacion.js";

import FacturaSolicitudes from "../components/facturas.js";
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

	getFormData(data) {
		const temp = Object.assign(factura.getData(), data);
		temp.lineas = this.getLineas().getData(); // lineas de la factura
		// si no hay descripcion => concateno los conceptos saneados y separados por punto
		temp.memo = temp.memo || temp.lineas.map(linea => sb.rtrim(linea.desc, "\\.").trim()).join(". ");
		return temp;
	}
}

customElements.define("fact-table", FacturaSolicitudes, { extends: "table" });

export default new Factura();
