
import FormBase from "../../components/forms/FormBase.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";
import valid from "../i18n/validators.js";

import factura from "../model/Factura.js";
import Organica from "./inputs/organica.js";
import Lineas from "./lineas.js";
import form from "./factura.js";

export default class Imputacion extends FormBase {
	#acOrganica = this.getElement("acOrganica");
	#acRecibo = this.setAutocomplete("acRecibo");
	#acTTPP = this.setAutocomplete("acTTPP");
	#lineas = this.querySelector("table");

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	getLineas = () => this.#lineas;
	init() {
		this.#acRecibo.setItemMode(4).setSource(term => {
			const url = factura.isExtension() ? "/uae/fact/recibos/tpv" : "/uae/fact/recibos/ac";
			api.init().json(url, { id: this.getValue("idOrg") || 0, term }).then(this.#acRecibo.render);
		});

		this.#acTTPP.setItemMode(4).setSource(term => {
			const id = this.getValue("idOrg"); // pk de la organica required
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
		tabs.setAction("allTTPP", () => {
			this.closeAlerts(); // hide prev. errors
			const id = this.getValue("idOrg"); // pk
			if (!id) // el campo organica es obligatorio!
				return this.setRequired("acOrganica", "Debe asociar una orgánica a esta solicitud.");
			if (confirm("¿Confirma que desea añadir todos los recibos a la solicitud?")) // cancel by user?
				api.init().json("/uae/ttpp/recibos/all?id=" + id).then(this.#lineas.addRecibos);
		});
	}

	view(data) {
		const fact = data.solicitud; // datos del servidor
		this.#acOrganica.setValue(fact.idOrg, fact.org + " - " + fact.descOrg);
		this.#acRecibo.setValue(fact.idRecibo, fact.acRecibo);
		this.#lineas.render(data.lineas); // render table
	}
}

customElements.define("organica-input", Organica, { extends: "input" });
customElements.define("linea-table", Lineas, { extends: "table" });
