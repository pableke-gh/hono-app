
import Form from "../../components/forms/Form.js";
import Table from "../../components/Table.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import i18n from "../../i18n/langs.js";

import model from "../model/Solicitud.js";
import firmas from "./firmas.js";
import uxxiec from "./uxxiec.js";

function List() {
	const self = this; //self instance
	const url = model.getUrl(); // url base path
	const form = new Form("#xeco-filter"); // filter form element

	const msgEmptyTable = "No se han encontrado solicitudes para a la búsqueda seleccionada";
	const opts = { msgEmptyTable, onRender: model.row, onFooter: model.tfoot };
	const tblSolicitudes = new Table(form.getForm().next("table"), opts);
	tblSolicitudes.set("is-procesable", model.isProcesable);

	const fnLoadList = data => { tblSolicitudes.render(data); tabs.showTab("list"); } // render table
	const fnCallList = () => { api.setJSON(form.getData()).json(url + "/list").then(fnLoadList); } // fetch list action
	const fnList = (estado, fmask) => { form.setData({ estado, fmask }, ".ui-filter"); fnCallList(); } // prepare filter and fetch
	const fnProcesando = data => tblSolicitudes.refreshRow(model.setData(data).setProcesando()); // avoid reclicks
	const fnLoadTab = (tab, data) => { firmas.update(data); tabs.showTab(tab); } // set firmas and show selected tab
	const fnView = data => {
		if (form.isCached(data.id))
			fnLoadTab("form", data);
		else
			api.init().json(url + "/view?id=" + data.id).then(model.view);
	}
	const fnReactivar = data => {
		if (!i18n.confirm("msgReactivar"))
			return; // cancel by user
		if (form.isCached(data.id))
			return tabs.showForm().invoke("reactivar");
		api.init().json(url + "/reactivar?id=" + data.id).then(data => {
			model.view(data); // update view data
			tabs.invoke("reactivar"); // show form
		});
	}

	this.getForm = () => form; // get filter form
	this.setCache = id => form.setCache(id); // set form cache
	this.getTable = () => tblSolicitudes;
	this.getId = tblSolicitudes.getId;
	this.loadFirmas = data => {
		const row = tblSolicitudes.getCurrentItem();
		if (form.isCached(row.id)) // checks if current item is cached
			firmas.view(data.firmas).refresh(data); // refresh firmas blocks + buttons
		fnProcesando(row); // avoid reclick
		tabs.showList(); // force tab list
	}

	this.init = () => {
		uxxiec.init(); // expediente uxxiec
		form.onKeydown(ev => ((ev.key == "Enter") && fnCallList()));

		// Show empty table and set handlers actions for solicitudes
		tblSolicitudes.render().set("#view", fnView).set("#uxxiec", uxxiec.view).set("#reject", data => fnLoadTab("reject", data));

		const fnFirmar = id => api.init().json(url + "/firmar?id=" + id).then(self.loadFirmas);
		tblSolicitudes.set("#firmar", data => (i18n.confirm("msgFirmar") && fnFirmar(data.id)));

		tblSolicitudes.set("#report", data => api.init().text(url + "/report?id=" + data.id).then(api.open)); // call report service
		tblSolicitudes.set("#pdf", data => api.setPdf().blob(url + "/pdf?id=" + data.id).then(api.open)); // report template service 

		const fnReset = data => { i18n.confirm("msgReactivar") && api.init().json(url + "/reset?id=" + data.id).then(model.view); }
		tblSolicitudes.set("#reactivar", fnReactivar).set("#reset", fnReset); // acciones para reactivar / resetear solicitud
		tblSolicitudes.set("#emails", data => api.init().json(url + "/emails?id=" + data.id).then(form.showAlerts)); // admin test email
		tblSolicitudes.set("#integrar", data => (i18n.confirm("msgIntegrar") && fnProcesando(data) && api.init().json(url + "/ws?id=" + data.id).then(form.showAlerts))); // llamada al servidor
		tblSolicitudes.setRemove(data => api.init().json(url + "/remove?id=" + data.id).then(tabs.showList)); // remove true = confirm
	}

	tabs.setInitEvent("list", () => { tblSolicitudes.isEmpty() && fnList("", "5"); });
	tabs.setAction("list", fnCallList);
	tabs.setAction("list-all", () => { form.reset(".ui-filter"); fnCallList(); });
	tabs.setAction("relist", () => fnList("", "5"));
	tabs.setAction("vinc", () => { ("1" == form.getValueByName("estado")) ? tabs.showTab("list") : fnList("1"); });

	tabs.setAction("ejecutar", () => api.setJSON(uxxiec.getExpediente()).json(url + "/ejecutar?id=" + tblSolicitudes.getId()).then(form.showAlerts));
	tabs.setAction("notificar", () => api.setJSON(uxxiec.getExpediente()).json(url + "/notificar?id=" + tblSolicitudes.getId()).then(form.showAlerts));

	tabs.setAction("report", () => tblSolicitudes.invoke("#report"));
	tabs.setAction("pdf", () => tblSolicitudes.invoke("#pdf"));
	tabs.setAction("remove", tblSolicitudes.removeRow);
}

export default new List();
