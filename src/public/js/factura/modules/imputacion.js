
import Form from "../../components/forms/Form.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";
import valid from "../i18n/validators.js";

import factura from "../model/Factura.js";
import Lineas from "./lineas.js";
import form from "./factura.js";

export default class Imputacion extends Form {
	#acOrganica = this.setAutocomplete("#acOrganica");
	#acRecibo = this.setAutocomplete("#acRecibo");
	#acTTPP = this.setAutocomplete("#acTTPP");
	#lineas = new Lineas(this);

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init() {
		// los usuarios de ttpp/gaca solo pueden ver las organicas de su unidad 300906XXXX
		this.#acOrganica.setItemMode(4).setSource(term => {
			api.init().json("/uae/fact/organicas", { term }).then(this.#acOrganica.render);
		});

		this.#acRecibo.setItemMode(4).setSource(term => {
			const url = factura.isExtension() ? "/uae/fact/recibos/tpv" : "/uae/fact/recibos/ac";
			api.init().json(url, { id: this.getValue("idOrg") || 0, term }).then(this.#acRecibo.render);
		});

		this.#acTTPP.setItemMode(4).setSource(term => {
			api.init().json("/uae/ttpp/recibos", { id: this.getValue("idOrg") || 0, term }).then(this.#acTTPP.render);
		});
	
		this.onChange("iva", ev => form.setIva(+ev.target.value));
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
		this.#acOrganica.setValue(fact.idOrg, fact.org + " - " + fact.descOrg);
		this.#acRecibo.setValue(fact.idRecibo, fact.acRecibo);
		this.#lineas.render(data.lineas); // render table
	}

	getLineas = () => this.#lineas;
}
