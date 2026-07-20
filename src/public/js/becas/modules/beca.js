
import api from "../../core/components/Api.js";
import tabs from "../../core/components/tabs/Tabs.js";

import beca from "../model/Beca.js";

import Tercero from "./tercero.js";
import Firmas from "../../core/components/layouts/Firmas.js";
import FormHTML from "../../core/components/forms/Form.js";

export default class BecaForm extends FormHTML {
	getBecas = () => tables.get("becas"); // tabla de solicitudes / registros
	getRegistros = () => this.getBecas(); // tabla de solicitudes / registros

	#load(firmas) {
		Firmas.notify(firmas);
		tabs.showForm(); // show form tab
	}
	create() {
		const data = { imp: 0, iva: 21, prorrata: +this.dataset.prorrata };
		super.create(beca.setData(data).getData()).#load(); // load form with default data
	}
	load = row => {
		if (!row) // row required
			return this.create();
		const fnLoad = (data, firmas) => {
			const editable = beca.setData(data).isEditable(); // check if data is editable
			super.load(data, editable).#load(firmas); // load form with data
		}

		if (this.isCached(row.id)) // check if data is cached
			return fnLoad(row, true); // go form tab directly
		const url = `/uae/becas/view?id=${row.id}&a=${row.apli}`; // resource
		api.init().json(url).then(data => { // server response
			fnLoad(row, data.firmas); // show firmas list
		});
	}

	close(firmas) {
		this.isCached(beca.getId()) && Firmas.notify(firmas);
		this.getBecas().showList(); // show list tab
	}
	reject = row => {
		super.notify(row); // notify row
		Firmas.notify(this.isCached(row.id));
		tabs.show("reject"); // show tab
	}

	connectedCallback() {
		super.connectedCallback(); // initialize form
		beca.setUser(this.dataset); // load user info
		tabs.setAction("create", () => this.create()); // set handlers

		const header = this.querySelector("h2"); // form header
		this.addObserver(data => { header.innerText = beca.getTitulo(); });
	}
}

customElements.define("tab-tercero", Tercero, { extends: "div" });
customElements.define("firmas-block", Firmas, { extends: "div" });
