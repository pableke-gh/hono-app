
import Form from "../../components/forms/Form.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"

import Documentos from "./documentos.js";

export default class Uxxiec extends Form {
	#acUxxi = this.setAutocomplete("#uxxi");
	#documentos = new Documentos(this.getNextElement());
	#solicitudes; #solicitud;

	constructor(opts) {
		super("#xeco-uxxi", opts);
		const fnRender = item => (item.num + " - " + item.uxxi + "<br>" + item.desc);
		this.#acUxxi.setMinLength(4).setSelect(item => item.id).setRender(fnRender);
	}

	#updateButtons = () => { // refresh buttons navbar
		this.getNext("div").$$(".form-refresh").refresh(this.#solicitud, this.getOptions());
	}
	view = data => {
		const fnLoadUxxiec = data => { // refresh form and buttons
			this.refresh(this.#solicitudes.load(data)).setCache(data.id);
			this.#updateButtons(); // update buttons navbar
			tabs.showTab("uxxiec"); // show selected tab
			this.#acUxxi.reload(); // Reload autocomplete
		}

		if (this.isCached(data.id)) // solicitud cacheada
			return fnLoadUxxiec(data); // muestro la vista cacheada
		const fnLoadDocs = docs => { this.#documentos.render(docs); fnLoadUxxiec(data); }
		api.init().json(this.#solicitud.getUrl() + "/uxxiec?id=" + data.id).then(fnLoadDocs);
	}

	setEvents(solicitudes) { // set default handlers
		this.#solicitudes = solicitudes.set("#uxxiec", this.view); // solicitudes module list
		this.#solicitud = solicitudes.getSolicitud(); // solicitud model instance

		const url = this.#solicitud.getUrl();
		const fnNotificable = () => (this.#documentos.size() && this.#solicitud.isNotificable());
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
				this.#solicitud.setEstado(estado); // update estado
				this.#solicitudes.refreshRow(); // refresh row in list
				this.#updateButtons(); // update buttons navbar
			});
		}
		tabs.setAction("ejecutar", () => fnSend(url + "/ejecutar?id=" + this.#solicitud.getId(), 3));
		tabs.setAction("notificar", () => fnSend(url + "/notificar?id=" + this.#solicitud.getId(), 4));
	}
}
