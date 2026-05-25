
import sb from "../../components/types/StringBox.js";
import valid from "../i18n/validators.js";

import factura from "../model/Factura.js";
import Fiscal from "./fiscal.js";

import Organica from "../components/inputs/Organica.js";
import AutocompleteRecibo from "../components/inputs/Recibo.js";
import AutocompleteTTPP from "../components/lineas/AutocompleteTTPP.js";
import AddLinea from "../components/lineas/AddLinea.js";
import AddAllRecibos from "../components/lineas/AddAllRecibos.js";
import Lineas from "../components/lineas/lineas.js";

import Firmas from "../../core/components/Firmas.js";
import FacturaSolicitudes from "../components/facturas.js";
import Solicitud from "../../core/modules/solicitud.js";

class Factura extends Solicitud {
	#fiscal = new Fiscal(this);
	#lineas = this.querySelector("table");

	init() { // init modules
		super.init(valid);
		this.#fiscal.init();
		this.addChange("iva", ev => this.setIva(+ev.target.value));
		return this;
	}

	onView(data) {
		this.#fiscal.view(data); // tercero + delegaciones + sujeto/exento + face
		this.#lineas.render(data.lineas); // render table
	}

	getSolicitudes = () => window.solicitudes; // tabla de solicitudes
	getFiscal = () => this.#fiscal; // datos fiscales (tercero + delegacion)
	getLineas = () => this.#lineas;

	setIva = iva => {
		this.#lineas.setIva(iva);
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

customElements.define("organica-input", Organica, { extends: "input" });
customElements.define("recibo-input", AutocompleteRecibo, { extends: "input" });
customElements.define("ttpp-input", AutocompleteTTPP, { extends: "input" });
customElements.define("add-linea", AddLinea, { extends: "button" });
customElements.define("add-all-recibos", AddAllRecibos, { extends: "button" });
customElements.define("linea-table", Lineas, { extends: "table" });

customElements.define("firmas-block", Firmas, { extends: "div" });
customElements.define("fact-table", FacturaSolicitudes, { extends: "table" });

export default new Factura();
