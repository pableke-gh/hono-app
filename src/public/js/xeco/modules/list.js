
import Form from "../../components/forms/Form.js";
import tabs from "../../components/Tabs.js";
import i18n from "../../i18n/langs.js";

import model from "../model/Solicitud.js";
import firmas from "./firmas.js";
import uxxiec from "./uxxiec.js";

function List() {
	const self = this; //self instance
	const form = new Form("#xeco-filter"); // filter form element

	const msgEmptyTable = "No se han encontrado solicitudes para a la búsqueda seleccionada";
	const opts = { msgEmptyTable, onRender: model.row, onFooter: model.tfoot };
	const tblSolicitudes = form.setTable("#solicitudes", opts);
	tblSolicitudes.set("is-procesable", model.isProcesable);

	const fnLoadTab = (tab, data) => {
		firmas.update(data); // update firmas view
		tabs.showTab(tab); // show selected tab
	}
	const rcView = data => {
		if (form.isCached(data.id))
			fnLoadTab("form", data);
		else
			self.send(window.rcView); // call server action
	}
	const fnReject = data => {
		fnLoadTab("reject", data);
	}
	const rcUxxiec = data => {
		if (uxxiec.isCached(data.id))
			fnLoadTab("uxxiec", data);
		else
			self.send(window.rcUxxiec);
		uxxiec.view(data);
	}

	const fnCallList = () => {
		setTimeout(form.loading, 1); // show loading after go new tab
		window.rcList(); // invoke list action to server
	}
	const fnList = (fEstado, fMiFirma) => { // prepare filter and call list action
		form.setData({ fEstado, fMiFirma}, ".ui-filter"); // set filter values
		fnCallList(); // invoke list action to server
	}
	const fnProcesando = data => { // avoid reclicks
		tblSolicitudes.refreshRow(model.setData(data).setProcesando());
		return self;
	}

	this.setSolicitudes = data => { tblSolicitudes.render(data); }
	this.setCache = id => form.setCache(id); // set form cache
	this.getTable = () => tblSolicitudes;
	this.send = tblSolicitudes.send

	this.init = () => {
		uxxiec.init(); // expediente uxxiec
		form.onKeydown(ev => ((ev.key == "Enter") && fnCallList()));
		const divSolicitudes = form.querySelector("#solicitudes-json");
		self.setSolicitudes(JSON.read(divSolicitudes?.innerHTML)); // preload data

		// Actions for solicitudes table
		tblSolicitudes.set("#rcView", rcView).set("#tab-reject", fnReject).set("#rcUxxiec", rcUxxiec);
		tblSolicitudes.set("#rcFirmar", data => (i18n.confirm("msgFirmar") && self.send(window.rcFirmar, data)));
		tblSolicitudes.set("#rcReport", data => self.send(window.rcReport, data)); // report service
		tblSolicitudes.set("#rcEmails", data => self.send(window.rcEmails, data)); // admin test email
		tblSolicitudes.setRemove(data => !self.send(window.rcRemove, data)); // remove true = confirm
		//tblSolicitudes.set("#rcPdf", () => { $1("#pdf").click(); setTimeout(window.working, 450); });
		tblSolicitudes.set("#rcReactivar", data => (i18n.confirm("msgReactivar") && self.send(window.rcReactivar, data)));
		tblSolicitudes.set("#rcIntegrar", data => (i18n.confirm("msgIntegrar") && fnProcesando(data) && self.send(window.rcIntegrar))); // llamada al servidor
	}

	const isEmptyEstado = () => { const value = form.getval("#fEstado"); return (!value || (value == "0")); }
	tabs.setInitEvent("list", () => (tblSolicitudes.isEmpty() && isEmptyEstado() && fnList("", "5")));
	tabs.setAction("list", fnCallList);
	tabs.setAction("list-all", () => { form.reset(".ui-filter").loading(); window.rcList(); });
	tabs.setAction("relist", () => fnList("", "5"));
	tabs.setAction("vinc", () => {
		if ("1" == form.getval("#fEstado"))
			tabs.showTab("list"); // estado aceptada
		else
			fnList("1");
	});

	tabs.setAction("reject", () => { fnReject(tblSolicitudes.getCurrentItem()); }); // open reject tab from list
	tabs.setAction("report", () => tblSolicitudes.invoke("#rcReport"));
	tabs.setAction("remove", tblSolicitudes.removeRow);

	window.loadFiltro = (xhr, status, args) => {
		window.showTab(xhr, status, args, "list") && self.setSolicitudes(JSON.read(args.data));
	}
	window.loadFirmas = (xhr, status, args) => {
		if (!window.showTab(xhr, status, args, "list"))
			return false; // Server error
		const data = tblSolicitudes.getCurrentItem();
		if (form.isCached(data.id)) // checks if current item is cached
			firmas.view(JSON.read(args.firmas)); // update firmas blocks
		fnProcesando(data); // avoid reclick
	}
}

export default new List();
