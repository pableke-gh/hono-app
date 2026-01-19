
import Form from "../../components/forms/Form.js";
import Table from "../../components/Table.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"

import Solicitud from "../model/Solicitud.js";
import uxxiec from "../model/Uxxiec.js";

class SolicitudExpediente {
	#solicitud = new Solicitud(); // create instance
	#form = new Form("#xeco-uxxi"); // uxxiec form module
	#acUxxi = this.#form.setAutocomplete("#uxxi", uxxiec.getAutocomplete());
	#documentos = new Table(this.#form.getNextElement(), uxxiec.getTable());

	getSolicitud = () => this.#solicitud; // get solicitud
	setSolicitud = model => {
		const tabUxxi = tabs.getTab("uxxiec"); // server info.
		this.#solicitud = model.setUser(tabUxxi.dataset).clone();
	}

	setData = data => { this.#solicitud.setData(data); } // solicitud data
	isCached = id => this.#solicitud.eq(id); // is solicitud loaded

	#updateButtons = () => { // refresh buttons navbar
		this.#form.getNext("div").$$(".form-refresh").refresh(this.#solicitud, this.#form.getOptions());
	}
	view = data => {
		const fnLoadUxxiec = data => { // refresh form and buttons
			this.#form.refresh(this.#solicitud.setData(data));
			this.#updateButtons(); // update buttons navbar
			tabs.showTab("uxxiec"); // show selected tab
			this.#acUxxi.reload(); // Reload autocomplete
		}

		if (this.isCached(data.id)) // solicitud cacheada
			return fnLoadUxxiec(data); // muestro la vista cacheada
		const fnLoadDocs = docs => { this.#documentos.render(docs); fnLoadUxxiec(data); }
		api.init().json(this.#solicitud.getUrl() + "/uxxiec?id=" + data.id).then(fnLoadDocs);
	}

	init = () => { // set default handlers
		const url = this.#solicitud.getUrl();
		const fnNotificable = () => (this.#documentos.size() && this.#solicitud.isNotificable());
		this.#form.set("is-ejecutable", this.#documentos.size).set("is-notificable", fnNotificable);
		this.#acUxxi.setSource(term => api.init().json(url + "/uxxiec/docs/", { ej: this.#form.getValueByName("ej"), term }).then(this.#acUxxi.render));

		tabs.setAction("addUxxi", () => {
			const doc = this.#acUxxi.getCurrentItem();
			if (doc && this.#documentos.add(doc)) // add document to table
				this.#updateButtons(); // update buttons navbar
			this.#acUxxi.reload(); // Reload autocomplete
		});

		// update estado + buttons after ejecutar / notificar actions
		const fnUpdate = estado => { this.#solicitud.setEstado(estado); this.#updateButtons(); this.list.refreshRow(); }
		tabs.setAction("ejecutar", () => api.setJSON(this.#documentos.getData()).json(url + "/ejecutar?id=" + this.#solicitud.getId()).then(() => fnUpdate(3)));
		tabs.setAction("notificar", () => api.setJSON(this.#documentos.getData()).json(url + "/notificar?id=" + this.#solicitud.getId()).then(() => fnUpdate(4)));
	}
}

export default new SolicitudExpediente();
