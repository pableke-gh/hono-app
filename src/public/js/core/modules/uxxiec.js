
import sb from "../../components/types/StringBox.js";
import tabs from "../components/tabs/TabsOld.js";
import api from "../components/Api.js"

import Solicitud from "../model/Solicitud.js";
import FormHTML from "../../components/forms/FormHTML.js";
import Uxxiec from "../components/uxxiec/Autocomplete.js";
import AddDocumento from "../components/uxxiec/AddDocumento.js";
import tables from "../components/tables/Tables.js";

export default class UxxiecForm extends FormHTML {
	getSolicitudes = () => tables.get("solicitudes"); // tabla de solicitudes
	connectedCallback() {
		//super.connectedCallback(); // init. component
		const documentos = this.nextElementSibling; // tabla de documentos
		const solicitud = Solicitud.getInstance(); // solicitud model instance

		const fnNotificable = () => (documentos.size() && solicitud.isNotificable());
		this.set("is-ejecutable", documentos.size).set("is-notificable", fnNotificable);
		this.elements.ej.setLabels(sb.getEjercicios()); // ultimos 6 ej

		const url = this.getAttribute("action");
		const fnSend = (url, estado) => {
			if (documentos.isEmpty()) // sin documentos asociados => error
				return this.showError("Debe asociar al menos una operación de UXXI-EC a la solicitud.");
			api.setJSON(documentos.getData()).json(url).then(() => {
				solicitud.setEstado(estado); // update estado
				this.getSolicitudes().showList(); // refresh row in list
				this.updateButtons(); // update buttons navbar
			});
		}
		tabs.setAction("ejecutar", () => fnSend(url + "/ejecutar?id=" + solicitud.getId(), 3));
		tabs.setAction("notificar", () => fnSend(url + "/notificar?id=" + solicitud.getId(), 4));
	}

	updateButtons() { // refresh buttons navbar
		this.next("div").$$(".form-refresh").refresh(Solicitud.getInstance(), this.getOptions());
	}
	view(data) {
		const fnLoadUxxiec = data => { // refresh form and buttons
			this.refresh(this.getSolicitudes().load(data)).setCache(data.id);
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
