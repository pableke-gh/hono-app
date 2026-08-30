
import sb from "../../components/types/StringBox.js";
import factura from "../model/Factura.js";

import Tercero from "../components/inputs/Tercero.js";
import Organica from "../components/inputs/Organica.js";
import AutocompleteRecibo from "../components/inputs/Recibo.js";

import Subtipo from "../components/inputs/Subtipo.js";
import Sujeto from "../components/inputs/Sujeto.js";
import Exento from "../components/inputs/Exento.js";
import Economica from "../components/inputs/Economica.js";
import Face from "../components/inputs/Face.js";
import Memoria from "../components/inputs/Memoria.js";
import Iva from "../components/inputs/Iva.js";

import AutocompleteTTPP from "../components/lineas/AutocompleteTTPP.js";
import AddLinea from "../components/lineas/AddLinea.js";
import AddAllRecibos from "../components/lineas/AddAllRecibos.js";

import Firmas from "../../core/components/layouts/Firmas.js";
import Solicitud from "../../core/modules/solicitud.js";
import tables from "../components/tables/tables.js";

class Factura extends Solicitud {
	getSolicitudes = () => tables.getSolicitudes(); // tabla de solicitudes
	getLineas = () => tables.get("lineas"); // tabla de conceptos de la factura

	onView(data) {
		this.getLineas().render(data.lineas); // render table
		setTimeout(() => this.getElement("tercero").focus(), 9); // set focus on first input after view is loaded
	}

	create(tipo, subtipo) {
		const data = {}; // container
		const ej = sb.getYear(); // current year
		data.solicitud = { ej, tipo, subtipo, imp: 0, iva: 0 };
		super.create(data);
	}
	createFactura() { this.create(1, 14); } // create factura
	createCartaPago() { this.create(3, 13); } // create carta de pago

	getFormData(data) {
		const temp = Object.assign(factura.getData(), data);
		temp.lineas = this.getLineas().getData(); // lineas de la factura
		// si no hay descripcion => concateno los conceptos saneados y separados por punto
		temp.memo = temp.memo || temp.lineas.map(linea => sb.rtrim(linea.desc, "\\.").trim()).join(". ");
		return temp;
	}
}

customElements.define("tercero-input", Tercero, { extends: "input" });
customElements.define("organica-input", Organica, { extends: "input" });
customElements.define("recibo-input", AutocompleteRecibo, { extends: "input" });

customElements.define("subtipo-list", Subtipo, { extends: "select" });
customElements.define("sujeto-list", Sujeto, { extends: "select" });
customElements.define("exento-list", Exento, { extends: "select" });
customElements.define("eco-list", Economica, { extends: "select" });
customElements.define("face-list", Face, { extends: "select" });
customElements.define("memo-text", Memoria, { extends: "textarea" });
customElements.define("iva-list", Iva, { extends: "select" });

customElements.define("ttpp-input", AutocompleteTTPP, { extends: "input" });
customElements.define("add-linea", AddLinea, { extends: "button" });
customElements.define("add-all-recibos", AddAllRecibos, { extends: "button" });
customElements.define("firmas-block", Firmas, { extends: "div" });

export default new Factura();
