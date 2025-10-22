
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
	const tblSolicitudes = new Table(form.getNext("table"), opts);

	const fnLoadList = data => { tblSolicitudes.render(data); tabs.showList(); } // render table
	const fnCallList = () => { api.setJSON(form.getData()).json(url + "/list").then(fnLoadList); } // fetch list action
	const fnList = (estado, fmask) => { form.setData({ estado, fmask }, ".ui-filter"); fnCallList(); } // prepare filter and fetch
	const fnLoadTab = (tab, data) => { firmas.update(data); tabs.showTab(tab); } // set firmas and show selected tab
	const fnUpdateRow = () => tblSolicitudes.refreshRow(model);
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

	this.getForm = () => form; // get the filter form
	this.setCache = form.setCache; // set cache on create and view
	this.getTable = () => tblSolicitudes; // table module
	this.getId = tblSolicitudes.getId;
	this.update = () => {
		fnUpdateRow(); // refresh current row
		tabs.showList(); // force tab list
	}
	this.firmar = data => {
		if (form.isCached(self.getId())) // checks if current item is cached
			firmas.view(data.firmas); // update firmas blocks + buttons
		else // el usuario intenta firmar un registro desde la tabla
			model.setData(tblSolicitudes.getCurrentItem()); // load selected row
		model.setProcesando(); // avoid reclicks
		self.update(); // force tab list
	}

	this.init = () => {
		uxxiec.init(); // expediente uxxiec
		form.onKeydown(ev => ((ev.key == "Enter") && fnCallList()));
		tblSolicitudes.view(); // initial render
	}

	// Set handlers for actions in solicitudes table
	tblSolicitudes.set("is-firmable", model.isFirmable).set("is-integrable", model.isIntegrable);
	tblSolicitudes.set("update-estado", td => { // actualizo la celda del estado
		td.className = model.getStyleByEstado() + " hide-xs table-refresh";
		td.innerHTML = model.getDescEstado();
	});

	tblSolicitudes.set("#view", fnView).set("#uxxiec", uxxiec.view).set("#reject", data => fnLoadTab("reject", data));
	tblSolicitudes.set("#firmar", data => i18n.confirm("msgFirmar") && api.init().json(url + "/firmar?id=" + data.id).then(self.firmar));

	tblSolicitudes.set("#report", data => api.init().text(url + "/report?id=" + data.id).then(api.open)); // call report service
	//tblSolicitudes.set("#pdf", data => api.init().blob(url + "/pdf?id=" + data.id).then(api.open)); // report template service 

	tblSolicitudes.set("#reactivar", fnReactivar).set("#reset", fnReactivar); // acciones para reactivar / resetear solicitud
	tblSolicitudes.set("#emails", data => api.init().json(url + "/emails?id=" + data.id)); // admin test email
	tblSolicitudes.setRemove(data => api.init().json(url + "/remove?id=" + data.id).then(tabs.showList)); // remove true = confirm
	tblSolicitudes.set("#integrar", data => { // integra la solicitud seleccionada en uxxiec
		i18n.confirm("msgIntegrar") && api.init().json(url + "/ws?id=" + data.id) // confirm and send
												.then(() => model.setData(data).setProcesando()) // avoid reclicks
												.then(fnUpdateRow); // update row
	});

	tabs.setInitEvent("list", () => { tblSolicitudes.isEmpty() && fnList("", "5"); });
	tabs.setAction("list", () => { form.isChanged() && fnCallList(); form.setChanged(); });
	tabs.setAction("list-all", () => { form.reset(".ui-filter"); fnCallList(); });
	tabs.setAction("relist", () => fnList("", "5"));
	tabs.setAction("vinc", () => { ("1" == form.getValueByName("estado")) ? tabs.showList() : fnList("1"); });

	tabs.setAction("ejecutar", () => uxxiec.ejecutar(tblSolicitudes.getId()).then(fnUpdateRow));
	tabs.setAction("notificar", () => uxxiec.notificar(tblSolicitudes.getId()).then(fnUpdateRow));

	tabs.setAction("report", () => tblSolicitudes.invoke("#report"));
	//tabs.setAction("pdf", () => tblSolicitudes.invoke("#pdf"));
	tabs.setAction("remove", tblSolicitudes.removeRow);
}

export default new List();
