
import Form from "../components/forms/Form.js";
import tabs from "../components/Tabs.js";
import pf from "../components/Primefaces.js";

import list from "./modules/list.js";
import uxxiec from "./modules/uxxiec.js";
import reject from "./modules/reject.js";
import firmas from "./modules/firmas.js";
import Solicitud from "./model/Solicitud.js";

function XecoForm() {
	const form = new Form("#xeco-model");
	const fnSend = (action, data) => pf.sendId(action, data.id);
	const rcView = data => {
		if (form.isCached(data.id))
			tabs.showTab(1); // show form tab
		else
			fnSend("rcView", data);
		reject.setCache(data.id);
	}
	const rcFirmar = data => {
		fnSend("rcFirmar", data);
	}
	const fnReject = data => {
		if (reject.isCached(data.id))
			return tabs.showTab(11);
		// cargo las firmas de la solicitud seleccionada
		fnSend("rcFirmas", data);
		reject.reset().setCache(data.id);
		form.resetCache(); // force reload view
	}
	const rcUxxiec = data => {
		if (uxxiec.isCached(data.id))
			tabs.showTab(15);
		else
			fnSend("rcUxxiec", data);
		if (!reject.isCached(data.id))
			firmas.hide(); // hide firmas
		uxxiec.load(data);
	}

	this.getForm = () => form;
	this.init = () => {
		const model = Solicitud.self(); // obtengo el modelo de solicitud

		/*** FORMULARIO PARA LA CREACIÓN DEL EXPEDIENTE CON UXXI-EC ***/
		const tabUxxi = tabs.getTab(15);
		model.setUser(tabUxxi.dataset);
		uxxiec.init();
		/*** FORMULARIO PARA LA CREACIÓN DEL EXPEDIENTE CON UXXI-EC ***/

		const solicitudes = list.load().getTable(); // preload data
		solicitudes.set("#rcView", rcView).set("#rcFirmar", rcFirmar);
		solicitudes.set("#tab-11", fnReject).set("#rcUxxiec", rcUxxiec);
		solicitudes.set("#rcReport", data => fnSend("rcReport", data));
		solicitudes.set("#rcEmails", data => fnSend("rcEmails", data));
		solicitudes.set("#rcRemove", data => fnSend("rcRemove", data));
		solicitudes.set("#rcIntegrar", (data, link, tr) => {
			tr.querySelectorAll(".estado").text("Procesando...");
			fnSend("rcIntegrar", data); // llamada al servidor
			link.hide(); // avoid reclick
		});
	}
	this.view = (data, principales) => {
		const model = Solicitud.self(); // obtengo el modelo de solicitud
		model.setData(data); // carga los datos de la solicitud antes de la vista
		firmas.setFirmas(principales); // vista de firmas asociadas
		form.closeAlerts().setCache(data.id).setData(data, ":not([type=hidden])");
	}
	this.update = data => {
		data && firmas.setFirmas(data); // firmas asociadas
	}
}

export default new XecoForm();
