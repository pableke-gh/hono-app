
import sb from "../../components/types/StringBox.js";
import FormHTML from "../../components/forms/FormHTML.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import Documentos from "./documentos.js";

export default class UxxiecForm extends FormHTML {
	#acUxxi = this.setAutocomplete("uxxi");

	connectedCallback() {
		const fnRender = item => (item.num + " - " + item.uxxi + "<br>" + item.desc);
		this.#acUxxi.setMinLength(4).setSelect(item => item.id).setRender(fnRender);

		// set default handlers
		const solicitudes = window.solicitudes; // tabla de solicitudes
		const solicitud = solicitudes.getSolicitud(); // solicitud model instance
		const documentos = this.nextElementSibling; // tabla de documentos
		solicitudes.set("#uxxiec", this.view); // solicitudes module list

		const url = solicitud.getUrl();
		const fnNotificable = () => (documentos.size() && solicitud.isNotificable());
		this.set("is-ejecutable", documentos.size).set("is-notificable", fnNotificable);
		this.#acUxxi.setSource(term => api.init().json(url + "/uxxiec/docs/", { ej: this.getValue("ej"), term }).then(this.#acUxxi.render));

		this.getElement("ej").setLabels(sb.getEjercicios()); // ultimos 6 ej
		tabs.setAction("addUxxi", () => {
			const doc = this.#acUxxi.getCurrentItem();
			if (doc && documentos.add(doc)) // add document to table
				this.#updateButtons(); // update buttons navbar
			this.#acUxxi.reload(); // Reload autocomplete
		});

		const fnSend = (url, estado) => {
			if (documentos.isEmpty()) // sin documentos asociados => error
				return this.showError("Debe asociar al menos una operación de UXXI-EC a la solicitud.");
			api.setJSON(documentos.getData()).json(url).then(() => {
				solicitud.setEstado(estado); // update estado
				solicitudes.showList(); // refresh row in list
				this.#updateButtons(); // update buttons navbar
			});
		}
		tabs.setAction("ejecutar", () => fnSend(url + "/ejecutar?id=" + solicitud.getId(), 3));
		tabs.setAction("notificar", () => fnSend(url + "/notificar?id=" + solicitud.getId(), 4));
	}

	#updateButtons = () => { // refresh buttons navbar
		const solicitud = window.solicitudes.getSolicitud(); // current instance
		this.next("div").$$(".form-refresh").refresh(solicitud, this.getOptions());
	}
	view = data => {
		const solicitudes = window.solicitudes; // tabla de solicitudes
		const solicitud = solicitudes.getSolicitud(); // solicitud model instance
		const fnLoadUxxiec = data => { // refresh form and buttons
			this.refresh(solicitudes.load(data)).setCache(data.id);
			this.#updateButtons(); // update buttons navbar
			tabs.show("uxxiec"); // show selected tab
			this.#acUxxi.reload(); // Reload autocomplete
		}

		if (this.isCached(data.id)) // solicitud cacheada
			return fnLoadUxxiec(data); // muestro la vista cacheada
		const fnLoadDocs = docs => { this.nextElementSibling.render(docs); fnLoadUxxiec(data); }
		api.init().json(solicitud.getUrl() + "/uxxiec?id=" + data.id).then(fnLoadDocs);
	}
}

customElements.define("docs-table", Documentos, { extends: "table" });
