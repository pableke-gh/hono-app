
import FormBase from "../../components/forms/FormBase.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";
import valid from "../i18n/validators.js";

import factura from "../model/Factura.js";
import Organica from "../components/inputs/organica.js";
import AddAllRecibos from "../components/AddAllRecibos.js";
import Lineas from "../components/lineas.js";
import form from "./factura.js";

export default class Imputacion extends FormBase {
	#organica = this.getElement("organica");
	#acRecibo = this.setAutocomplete("acRecibo");
	#acTTPP = this.setAutocomplete("acTTPP");
	#lineas = this.querySelector("table");

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	getLineas = () => this.#lineas;
	init() {
		this.#acRecibo.setItemMode(4).setSource(term => {
			const id = this.#organica.getValue() || 0; // pk de la organica optional
			const url = factura.isExtension() ? "/uae/fact/recibos/tpv" : "/uae/fact/recibos/ac";
			api.init().json(url, { id, term }).then(this.#acRecibo.render);
		});

		this.#acTTPP.setItemMode(4).setSource(term => {
			const id = this.#organica.getValue(); // pk de la organica required
			id && api.init().json("/uae/ttpp/recibos", { id, term }).then(this.#acTTPP.render);
		});

		this.addChange("iva", ev => form.setIva(+ev.target.value));
		tabs.setAction("addLinea", () => {
			this.closeAlerts(); // hide prev. errors
			if (factura.isTtppEmpresa()) { // tipo recibo ttpp
				this.#lineas.addRecibo(this.#acTTPP.getCurrentItem());
				return this.#acTTPP.reload();
			}
			this.#lineas.addLinea(valid.linea());
		});
	}

	view(data) {
		const fact = data.solicitud; // datos del servidor
		this.#acRecibo.setValue(fact.idRecibo, fact.acRecibo);
		this.#lineas.render(data.lineas); // render table
	}
}

customElements.define("organica-input", Organica, { extends: "input" });
customElements.define("add-all-recibos", AddAllRecibos, { extends: "button" });
customElements.define("linea-table", Lineas, { extends: "table" });
