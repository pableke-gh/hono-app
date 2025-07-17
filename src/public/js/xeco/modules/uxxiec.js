
import Form from "../../components/forms/Form.js";
import Table from "../../components/Table.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"

import model from "../model/Solicitud.js";
import uxxiec from "../model/Uxxiec.js";
import firmas from "./firmas.js";

function Uxxiec() {
    const form = new Form("#xeco-uxxi");
	const tblUxxiec = new Table(form.getForm().nextElementSibling, uxxiec.getTable());
    const acUxxi = form.setAutocomplete("#uxxi", uxxiec.getAutocomplete());
	acUxxi.setSource(term => api.init().json(model.getUrl("/uxxiec/docs/"), { ej: form.getValueByName("ej"), term }).then(acUxxi.render));

	this.getForm = () => form;
	this.getTable = () => tblUxxiec;
	this.getExpediente = () => tblUxxiec.getData();
	this.setExpediente = tblUxxiec.render;
	this.isCached = form.isCached;

	this.init = () => {
		const tabUxxi = tabs.getTab("uxxiec");
		model.setUser(tabUxxi.dataset);

		form.set("is-notificable", model.isNotificable).set("is-cancelable", model.isCancelable);
		form.addClick("a#add-uxxi", () => {
			const doc = acUxxi.getCurrentItem();
			doc && tblUxxiec.add(doc); // Add and remove PK autocalculated in v_*_uxxiec
			acUxxi.reload(); // Reload autocomplete
		});
	}

	const fnLoadUxxiec = data => {
		acUxxi.reload(); // Reload autocomplete
		// Update form-uxxiec cache and view
		form.setCache(data.id).refresh(model.setData(data));
		firmas.update(data); // update firmas view
		tabs.showTab("uxxiec"); // show selected tab
	}
	this.view = data => {
		if (form.isCached(data.id)) // solicitud cacheada
			return fnLoadUxxiec(data); // muestro la vista cacheada
		const fnLoadDocs = docs => { tblUxxiec.render(docs); fnLoadUxxiec(data); }
		api.init().json(model.getUrl("/uxxiec?id=" + data.id)).then(fnLoadDocs);
	}
}

export default new Uxxiec();
