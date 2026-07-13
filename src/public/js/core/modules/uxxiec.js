
import sb from "../../components/types/StringBox.js";
import tabs from "../components/tabs/TabsOld.js";
import api from "../components/Api.js"

import Solicitud from "../model/Solicitud.js";
import FormHTML from "../../components/forms/FormHTML.js";
import Uxxiec from "./uxxiec/Autocomplete.js";
import AddDocumento from "./uxxiec/AddDocumento.js";
import Documentos from "./uxxiec/Documentos.js";

export default class UxxiecForm extends FormHTML {
	connectedCallback() {
		//super.connectedCallback(); // init. component
		const solicitudes = window.solicitudes; // tabla de solicitudes
		const documentos = this.nextElementSibling; // tabla de documentos
		const solicitud = Solicitud.getInstance(); // solicitud model instance
		//this.setTable(documentos); // set linked table

		const fnNotificable = () => (documentos.size() && solicitud.isNotificable());
		this.set("is-ejecutable", documentos.size).set("is-notificable", fnNotificable);
		this.elements.ej.setLabels(sb.getEjercicios()); // ultimos 6 ej

		const url = this.getAttribute("action");
		const fnSend = (url, estado) => {
			if (documentos.isEmpty()) // sin documentos asociados => error
				return this.showError("Debe asociar al menos una operación de UXXI-EC a la solicitud.");
			api.setJSON(documentos.getData()).json(url).then(() => {
				solicitud.setEstado(estado); // update estado
				solicitudes.showList(); // refresh row in list
				this.updateButtons(); // update buttons navbar
			});
		}
		tabs.setAction("ejecutar", () => fnSend(url + "/ejecutar?id=" + solicitud.getId(), 3));
		tabs.setAction("notificar", () => fnSend(url + "/notificar?id=" + solicitud.getId(), 4));
	}

	updateButtons() { // refresh buttons navbar
		const solicitud = window.solicitudes.getSolicitud(); // current instance
		this.next("div").$$(".form-refresh").refresh(solicitud, this.getOptions());
	}
	view = data => {
		const fnLoadUxxiec = data => { // refresh form and buttons
			this.refresh(window.solicitudes.load(data)).setCache(data.id);
			this.updateButtons(); // update buttons navbar
			tabs.show("uxxiec"); // show selected tab
			this.getElement("uxxi").reload(); // Reload autocomplete
		}

		if (this.isCached(data.id)) // solicitud cacheada
			return fnLoadUxxiec(data); // muestro la vista cacheada

		const url = this.getAttribute("action") + "/uxxiec?id=" + data.id;
		api.init().json(url).then(docs => {
			this.nextElementSibling.render(docs);
			fnLoadUxxiec(data);
		});
	}
}

customElements.define("doc-uxxiec", Uxxiec, { extends: "input" });
customElements.define("add-doc", AddDocumento, { extends: "button" });
customElements.define("docs-table", Documentos, { extends: "table" });
