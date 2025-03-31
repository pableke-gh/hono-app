
import Form from "../components/forms/Form.js";
import tabs from "../components/Tabs.js";
import i18n from "../i18n/langs.js";

import model from "./model/Solicitud.js";
import firmas from "./modules/firmas.js";
import list from "./modules/list.js";
import uxxiec from "./modules/uxxiec.js";

function XecoForm() {
	const self = this; //self instance
	const form = new Form("#xeco-model");

	this.send = (action, name, value) => { form.loading(); window[action]([{ name, value }]); }
	this.sendId = (action, value) => self.send(action, "id", value);
	const fnSend = (action, data) => self.sendId(action, data.id);

	const rcView = data => {
		if (form.isCached(data.id))
			tabs.showTab("form"); // show form tab
		else
			fnSend("rcView", data);
	}
	const fnReject = data => {
		if (form.isCached(data.id))
			tabs.showTab("reject");
		else
			fnSend("rcReject", data);
	}
	const rcUxxiec = data => {
		if (uxxiec.isCached(data.id))
			tabs.showTab("uxxiec");
		else
			fnSend("rcUxxiec", data);
		if (!form.isCached(data.id))
			form.resetCache(); // force reload
		uxxiec.view(data);
	}

	this.getForm = () => form;
	this.init = () => {
		firmas.init();
		uxxiec.init();

		// hack editable inputs for PF
		form.eachInput(".readonly-manual", el => { el.dataset.readonly = "manual"; });
		form.eachInput(".editable-uae", el => { el.dataset.readonly = "is-editable-uae"; });

		// Actions for solicitudes table
		const solicitudes = list.load().getTable(); // preload data
		solicitudes.set("#rcView", rcView).set("#tab-reject", fnReject).set("#rcUxxiec", rcUxxiec);
		solicitudes.set("#rcFirmar", data => fnSend("rcFirmar", data));
		solicitudes.set("#rcReport", data => fnSend("rcReport", data));
		solicitudes.set("#rcEmails", data => fnSend("rcEmails", data)); // admin test email
		solicitudes.setRemove(data => !fnSend("rcRemove", data)); // remove true = confirm
		solicitudes.set("#rcIntegrar", data => {
			list.updateRow();  // avoid reclick
			fnSend("rcIntegrar", data); // llamada al servidor
		});
	}

	this.view = (data, principales) => {
		model.setData(data).update(data); // 1º carga los datos de la solicitud
		firmas.view(principales); // 2º cargo la vista de firmas asociadas
		form.closeAlerts().setCache(data.id).setData(data, ":not([type=hidden])");
		// 3º force last action => update form views and go to tab form
		setTimeout(() => { form.setEditable().refresh(data); tabs.showTab("form"); }, 1);
	}
	this.update = (data, principales, tab) => {
		data = data || model.getData(); // default = current data
		model.setData(data).update(data); // 1º carga los datos de la solicitud
		principales && firmas.view(principales); // 2º actualizo la vista de firmas asociadas
		// 3º force last action => update form views and go to specific tab
		setTimeout(() => { form.refresh(data).nextTab(tab); }, 1);
	}

	/*** Init. actions for model form ***/
	form.set("is-disabled", model.isDisabled).set("is-editable", model.isEditable).set("is-editable-uae", model.isEditableUae)
		.set("is-firmable", model.isFirmable).set("is-cancelable", model.isCancelable).set("is-invalidable", model.isInvalidable)
		.set("is-reactivable", model.isReactivable).set("is-subsanable", model.isSubsanable).set("is-valid", globalThis.void)
		.set("is-removable", model.isRemovable);  
	tabs.setAction("send", () => { form.fire("is-valid") && i18n.confirm("msgSend") && form.invoke(window.rcSend); }); // send from xeco-model form
	tabs.setAction("firmar", () => { i18n.confirm("msgFirmar") && form.invoke(window.rcFirmarForm); }); // run remote command from xeco-model
	tabs.setAction("reject", () => { fnReject(list.getCurrentItem()); }); // open reject tab from list
	tabs.setAction("reactivar", () => { model.setSubsanable(); form.setEditable().refresh(model.getData()); }); // update editable inputs
	tabs.setAction("subsanar", () => { form.fire("is-valid") && i18n.confirm("msgSave") && form.invoke(window.rcSubsanar); }); // send from changes
	tabs.setAction("ejecutar", () => { uxxiec.save(); form.invoke(window.rcEjecutar); });
	tabs.setAction("notificar", () => { uxxiec.save(); form.invoke(window.rcNotificar); });
}

export default new XecoForm();
