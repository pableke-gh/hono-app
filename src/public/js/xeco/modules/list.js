
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
	const form = new Form("#xeco-filter"); // filter form element

	const msgEmptyTable = "No se han encontrado solicitudes para a la búsqueda seleccionada";
	const opts = { msgEmptyTable, onRender: model.row, onFooter: model.tfoot };
	const tblSolicitudes = new Table(form.getForm().next("table"), opts);
	tblSolicitudes.set("is-procesable", model.isProcesable);

	const fnLoadTab = (tab, data) => {
		firmas.update(data); // update firmas view
		tabs.showTab(tab); // show selected tab
	}
	const fnView = data => {
		if (form.isCached(data.id))
			return fnLoadTab("form", data);
		api.init().json(model.getUrl("/view?id=" + data.id)).then(model.view);
	}

	const fnLoad = data => { tblSolicitudes.render(data); tabs.showTab("list"); } // render table
	const fnCallList = () => { api.setJSON(form.getData()).json(model.getUrl("/list")).then(fnLoad); } // fetch list action
	const fnList = (estado, fmask) => { form.setData({ estado, fmask }, ".ui-filter"); fnCallList(); } // prepare filter and fetch
	const fnProcesando = data => tblSolicitudes.refreshRow(model.setData(data).setProcesando()); // avoid reclicks

	this.setCache = id => form.setCache(id); // set form cache
	this.getTable = () => tblSolicitudes;
	this.getId = tblSolicitudes.getId;
	this.send = tblSolicitudes.send
	this.loadFirmas = data => {
		const row = tblSolicitudes.getCurrentItem();
		if (form.isCached(row.id)) // checks if current item is cached
			firmas.view(data.firmas); // update firmas blocks
		tabs.showMsgs(data.msgs, "list"); // force tab list
		fnProcesando(row); // avoid reclick
	}

	this.init = () => {
		uxxiec.init(); // expediente uxxiec
		form.onKeydown(ev => ((ev.key == "Enter") && fnCallList()));
		const divSolicitudes = tblSolicitudes.getTable().previousElementSibling;
		tblSolicitudes.render(JSON.read(divSolicitudes?.innerHTML)); // preload data

		// Actions for solicitudes table
		tblSolicitudes.set("#rcView", fnView).set("#rcUxxiec", uxxiec.view)
					.set("#tab-reject", data => fnLoadTab("reject", data));

		const fnFirmar = id => api.init().json(model.getUrl("/firmar?id=" + id)).then(self.loadFirmas);
		tblSolicitudes.set("#firmar", data => (i18n.confirm("msgFirmar") && fnFirmar(data.id)));

		const fnReport = url => (url ? window.open(url) : form.showError("No se ha podido abrir el informe seleccionado."));
		tblSolicitudes.set("#report", data => api.init().text(model.getUrl("/report?id=" + data.id)).then(fnReport)); // call report service
		tblSolicitudes.set("#pdf", data => api.setPdf().blob(model.getUrl("/pdf?id=" + data.id)).then(fnReport)); // report template service 

		tblSolicitudes.set("#emails", data => api.init().json(model.getUrl("/emails?id=" + data.id)).then(form.showAlerts)); // admin test email
		tblSolicitudes.set("#rcReactivar", data => (i18n.confirm("msgReactivar") && self.send(window.rcReactivar, data))); // reactivate call
		tblSolicitudes.set("#integrar", data => (i18n.confirm("msgIntegrar") && fnProcesando(data) && api.init().json(model.getUrl("/ws?id=" + data.id)).then(form.showAlerts))); // llamada al servidor
		tblSolicitudes.setRemove(data => api.init().json(model.getUrl("/remove?id=" + data.id)).then(msgs => tabs.showMsgs(msgs, "list"))); // remove true = confirm
	}

	const isEmptyEstado = () => { const value = form.getValueByName("estado"); return (!value || (value == "0")); }
	tabs.setInitEvent("list", () => (tblSolicitudes.isEmpty() && isEmptyEstado() && setTimeout(form.loading, 1) && fnList("", "5")));
	tabs.setAction("list", fnCallList);
	tabs.setAction("list-all", () => { form.reset(".ui-filter"); fnCallList(); });
	tabs.setAction("relist", () => fnList("", "5"));
	tabs.setAction("vinc", () => { ("1" == form.getValueByName("estado")) ? tabs.showTab("list") : fnList("1"); });

	tabs.setAction("ejecutar", () => api.setJSON(uxxiec.getExpediente()).json(model.getUrl("/ejecutar?id=" + tblSolicitudes.getId())).then(tabs.showMsgs));
	tabs.setAction("notificar", () => api.setJSON(uxxiec.getExpediente()).json(model.getUrl("/notificar?id=" + tblSolicitudes.getId())).then(tabs.showMsgs));

	tabs.setAction("report", () => tblSolicitudes.invoke("#report"));
	tabs.setAction("pdf", () => tblSolicitudes.invoke("#pdf"));
	tabs.setAction("remove", tblSolicitudes.removeRow);
}

export default new List();
