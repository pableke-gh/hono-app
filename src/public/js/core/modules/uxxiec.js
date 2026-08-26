
import sb from "../../components/types/StringBox.js";
import tabs from "../components/tabs/Tabs.js";
import api from "../components/Api.js"

import Solicitud from "../model/Solicitud.js";
import FormHTML from "../../components/forms/FormHTML.js";
import MsgUxxiec from "../components/uxxiec/MsgUxxiec.js";
import Uxxiec from "../components/uxxiec/Autocomplete.js";
import AddDocumento from "../components/uxxiec/AddDocumento.js";
import ButtonEjecutar from "../components/uxxiec/Ejecutar.js";
import ButtonNotificar from "../components/uxxiec/Notificar.js";
import tables from "../components/tables/Tables.js";

export default class UxxiecForm extends FormHTML {
	getDocumentos = () => tables.get("docs"); // tabla de documentos
	getSolicitudes = () => tables.getSolicitudes(); // tabla de solicitudes
	reactivate() { super.reactivate(Solicitud.getInstance()); }

	connectedCallback() {
		this.elements.ej.setLabels(sb.getEjercicios()); // ultimos 6 ej
	}

	send(url, estado) {
		const documentos = this.getDocumentos(); // tabla de documentos
		if (documentos.isEmpty()) // sin documentos asociados => error
			return this.showError("Debe asociar al menos una operación de UXXI-EC a la solicitud.");
		api.setJSON(documentos.getData()).json(url).then(() => {
			Solicitud.getInstance().setEstado(estado); // update estado
			this.getSolicitudes().showList(); // refresh row in list
			this.reactivate(); // update buttons navbar
		});
	}

	view(data) {
		const fnLoadUxxiec = data => { // refresh form and buttons
			super.reactivate(this.getSolicitudes().load(data));
			tabs.show("uxxiec"); // show selected tab
			this.elements.uxxi.reload(); // reload autocomplete
		}

		if (this.isCached(data.id)) // solicitud cacheada
			return fnLoadUxxiec(data); // muestro la vista cacheada

		const url = this.getAttribute("action") + "/uxxiec?id=" + data.id;
		api.init().json(url).then(docs => {
			this.getDocumentos().render(docs);
			fnLoadUxxiec(data);
		});
	}
}

customElements.define("msg-uxxiec", MsgUxxiec, { extends: "p" });
customElements.define("doc-uxxiec", Uxxiec, { extends: "input" });
customElements.define("add-doc", AddDocumento, { extends: "button" });
customElements.define("btn-ejecutar", ButtonEjecutar, { extends: "button" });
customElements.define("btn-notificar", ButtonNotificar, { extends: "button" });
