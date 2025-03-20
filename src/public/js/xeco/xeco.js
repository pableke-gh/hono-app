
import coll from "../components/CollectionHTML.js";
import Form from "../components/forms/Form.js";
import tabs from "../components/Tabs.js";
import pf from "../components/Primefaces.js";
import i18n from "../i18n/langs.js";

import model from "./model/Solicitud.js";
import firma from "./model/Firma.js";
import list from "./modules/list.js";
import uxxiec from "./modules/uxxiec.js";

function XecoForm() {
	const form = new Form("#xeco-model");

	const fnSend = (action, data) => pf.sendId(action, data.id);
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
		/*** FORMULARIO PARA LA CREACIÓN DEL EXPEDIENTE CON UXXI-EC ***/
		const tabUxxi = tabs.getTab("uxxiec");
		model.setUser(tabUxxi.dataset);
		uxxiec.init();
		/*** FORMULARIO PARA LA CREACIÓN DEL EXPEDIENTE CON UXXI-EC ***/

		const solicitudes = list.load().getTable(); // preload data
		solicitudes.set("#rcView", rcView).set("#tab-reject", fnReject).set("#rcUxxiec", rcUxxiec);
		solicitudes.set("#rcFirmar", data => fnSend("rcFirmar", data));
		solicitudes.set("#rcReport", data => fnSend("rcReport", data));
		solicitudes.set("#rcEmails", data => fnSend("rcEmails", data));
		solicitudes.set("#rcRemove", data => fnSend("rcRemove", data));
		solicitudes.set("#rcIntegrar", (data, link, tr) => {
			tr.querySelectorAll(".estado").text("Procesando...");
			fnSend("rcIntegrar", data); // llamada al servidor
			link.hide(); // avoid reclick
		});
	}

	const fnLoadFirmas = firmas => {
		const blocks = form.querySelectorAll(".ui-firmantes");
		if (!firmas) // no hay firmas => hide view
			return blocks.forEach(el => el.parentNode.hide());
		blocks.html(coll.render(firmas, firma.render));
		blocks.forEach(el => el.parentNode.show());
		form.reset("#rechazo");
	}
	this.view = (data, firmas) => {
		model.setData(data); // 1º carga los datos de la solicitud
		fnLoadFirmas(firmas); // 2º cargo la vista de firmas asociadas
		form.closeAlerts().setCache(data.id).setData(data, ":not([type=hidden])")//.setEditable()
			.readonly(model.isDisabled(), ":not(.readonly-manual)").readonly(!model.isEditableUae(), ".editable-uae")
			.refresh(data); // 3º update form views
		tabs.showTab("form"); // navego al tab form
	}
	this.setFirmas = (data, firmas) => {
		model.setData(data); // 1º carga los datos de la solicitud
		fnLoadFirmas(firmas); // 2º cargo la vista de firmas asociadas
		form.refresh(data); // 3º update form views
		tabs.showTab("reject"); // navego al tab reject
	}

	/*** Init. actions for model form ***/
	const fnClickNext = link => { link.nextElementSibling.click(); window.loading(); };
	form.set("is-editable", model.isEditable).set("is-editable-uae", model.isEditableUae)
		.set("is-firmable", model.isFirmable).set("is-rechazable", model.isRechazable); 
	tabs.setAction("send", link => { model.validate() && i18n.confirm("msgSend") && fnClickNext(link); });
	tabs.setAction("firmar", link => { i18n.confirm("msgFirmar") && fnClickNext(link); });
	tabs.setAction("reject", () => { fnReject(list.getCurrentItem()); });
	tabs.setAction("ejecutar", link => { uxxiec.save(); fnClickNext(link); });
	tabs.setAction("notificar", link => { uxxiec.save(); fnClickNext(link); });
	/*** Init. actions for model form ***/

	window.fnRechazar = () => {
		return form.validate(firma.validate) && i18n.confirm("msgRechazar") && window.loading();
	}
}

export default new XecoForm();
