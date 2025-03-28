
import coll from "../components/CollectionHTML.js";
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

	this.send = (action, name, value) => window[action]([{ name, value }]);
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
	this.setValidator = fnValid => { model.validate = fnValid; }
	this.init = () => {
		firmas.init();
		uxxiec.init();

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
		form.closeAlerts().setCache(data.id).setData(data, ":not([type=hidden])")//.setEditable()
			.readonly(model.isDisabled(), ":not(.readonly-manual)").readonly(!model.isEditableUae(), ".editable-uae")
			.refresh(data); // 3º update form views
		tabs.showTab("form"); // navego al tab form
	}
	this.update = (data, principales, tab) => {
		data = data || model.getData(); // default = current data
		model.setData(data).update(data); // 1º carga los datos de la solicitud
		principales && firmas.view(principales); // 2º actualizo la vista de firmas asociadas
		form.refresh(data).nextTab(tab); // 3º update form views
	}

	/*** Init. actions for model form ***/
	form.set("is-editable", model.isEditable).set("is-editable-uae", model.isEditableUae)
		.set("is-firmable", model.isFirmable).set("is-rechazable", model.isRechazable)
		.set("is-removable", model.isRemovable);
	tabs.setAction("send", () => { model.validate() && i18n.confirm("msgSend") && form.invoke(window.rcSend); }); // send from xeco-model form
	tabs.setAction("firmar", () => { i18n.confirm("msgFirmar") && form.invoke(window.rcFirmarForm); }); // run remote command from xeco-model
	tabs.setAction("reject", () => { fnReject(list.getCurrentItem()); }); // open reject tab from list
	tabs.setAction("ejecutar", () => { uxxiec.save(); form.invoke(window.rcEjecutar); });
	tabs.setAction("notificar", () => { uxxiec.save(); form.invoke(window.rcNotificar); });

	window.loadFirmas = (xhr, status, args) => {
		if (!window.showTab(xhr, status, args, "list"))
			return false; // Server error
		const data = list.getCurrentItem(); // get current item
		if (form.isCached(data.id)) // checks if current item is cached
			firmas.view(coll.parse(args.firmas)); // update firmas blocks
		list.updateRow();  // avoid reclick
	}
}

export default new XecoForm();
