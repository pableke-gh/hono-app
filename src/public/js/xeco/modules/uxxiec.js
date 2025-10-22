
import Form from "../../components/forms/Form.js";
import Table from "../../components/Table.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"

import model from "../model/Solicitud.js";
import uxxiec from "../model/Uxxiec.js";

function Uxxiec() {
	const self = this; //self instance
	const url = model.getUrl(); // url base path
    const form = new Form("#xeco-uxxi"); // form element for expediente UXXI-EC
	const tblUxxiec = new Table(form.getNextElement(), uxxiec.getTable());
    const acUxxi = form.setAutocomplete("#uxxi", uxxiec.getAutocomplete());
	acUxxi.setSource(term => api.init().json(url + "/uxxiec/docs/", { ej: form.getValueByName("ej"), term }).then(acUxxi.render));

	this.getForm = () => form;
	this.getTable = () => tblUxxiec;
	this.getExpediente = tblUxxiec.getData;
	this.setExpediente = tblUxxiec.render;
	this.isCached = form.isCached;

	this.init = () => {
		const tabUxxi = tabs.getTab("uxxiec");
		model.setUser(tabUxxi.dataset);
		form.set("is-cancelable", model.isCancelable).set("is-ejecutable", tblUxxiec.size)
			.set("is-notificable", () => (tblUxxiec.size() && model.isNotificable()));
	}

	const fnUpdateButtons = () => { // refresh buttons navbar
		form.getNext("div").querySelectorAll(".form-refresh").refresh(model, form.getOptions());
	}
	const fnLoadUxxiec = data => { // refresh form and buttons
		form.setCache(data.id).refresh(model.setData(data));
		fnUpdateButtons(); // update buttons navbar
		tabs.showTab("uxxiec"); // show selected tab
		acUxxi.reload(); // Reload autocomplete
	}

	this.view = data => {
		if (form.isCached(data.id)) // solicitud cacheada
			return fnLoadUxxiec(data); // muestro la vista cacheada
		const fnLoadDocs = docs => { tblUxxiec.render(docs); fnLoadUxxiec(data); }
		api.init().json(url + "/uxxiec?id=" + data.id).then(fnLoadDocs);
	}
	tabs.setAction("addUxxi", () => {
		const doc = acUxxi.getCurrentItem();
		if (doc && tblUxxiec.add(doc)) // add document to table
			fnUpdateButtons(); // update buttons navbar
		acUxxi.reload(); // Reload autocomplete
	});

	const fnUpdate = estado => { model.setEstado(estado); fnUpdateButtons(); } // set estado + buttons navbar
	this.ejecutar = id => api.setJSON(self.getExpediente()).json(url + "/ejecutar?id=" + id).then(() => fnUpdate(3));
	this.notificar = id => api.setJSON(self.getExpediente()).json(url + "/notificar?id=" + id).then(() => fnUpdate(4));
}

export default new Uxxiec();
