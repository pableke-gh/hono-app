
import Form from "../../components/forms/Form.js";
import Table from "../../components/Table.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"

import uxxiec from "../model/Uxxiec.js";
import solicitudes from "./solicitudes.js";

class Uxxiec extends Form {
	#acUxxi = this.setAutocomplete("#uxxi", uxxiec.getAutocomplete());
	#documentos = new Table(this.getNextElement(), uxxiec.getTable());

	constructor(opts) {
		super("#xeco-uxxi", opts);
	}

	#updateButtons = () => { // refresh buttons navbar
		this.getNext("div").$$(".form-refresh").refresh(solicitudes.getSolicitud(), this.getOptions());
	}
	view = data => {
		const fnLoadUxxiec = data => { // refresh form and buttons
			this.refresh(solicitudes.load(data)).setCache(solicitudes.getId());
			this.#updateButtons(); // update buttons navbar
			tabs.showTab("uxxiec"); // show selected tab
			this.#acUxxi.reload(); // Reload autocomplete
		}

		if (this.isCached(solicitudes.getId())) // solicitud cacheada
			return fnLoadUxxiec(data); // muestro la vista cacheada
		const fnLoadDocs = docs => { this.#documentos.render(docs); fnLoadUxxiec(data); }
		api.init().json(solicitudes.getSolicitud().getUrl() + "/uxxiec?id=" + data.id).then(fnLoadDocs);
	}

	setEvents() { // set default handlers
		const solicitud = solicitudes.getSolicitud();
		const url = solicitudes.getSolicitud().getUrl();
		const fnNotificable = () => (this.#documentos.size() && solicitud.isNotificable());
		this.set("is-ejecutable", this.#documentos.size).set("is-notificable", fnNotificable);
		this.#acUxxi.setSource(term => api.init().json(url + "/uxxiec/docs/", { ej: this.getValueByName("ej"), term }).then(this.#acUxxi.render));

		tabs.setAction("addUxxi", () => {
			const doc = this.#acUxxi.getCurrentItem();
			if (doc && this.#documentos.add(doc)) // add document to table
				this.#updateButtons(); // update buttons navbar
			this.#acUxxi.reload(); // Reload autocomplete
		});

		const fnSend = (url, estado) => {
			if (this.#documentos.isEmpty()) // sin documentos asociados => error
				return this.showError("Debe asociar al menos una operación de UXXI-EC a la solicitud.");
			api.setJSON(this.#documentos.getData()).json(url).then(() => {
				solicitud.setEstado(estado); // update estado
				solicitudes.refreshRow(); // refresh row in list
				this.#updateButtons(); // update buttons navbar
			});
		}
		tabs.setAction("ejecutar", () => fnSend(url + "/ejecutar?id=" + solicitud.getId(), 3));
		tabs.setAction("notificar", () => fnSend(url + "/notificar?id=" + solicitud.getId(), 4));
	}
}

export default new Uxxiec();
