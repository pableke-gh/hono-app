
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

	const fnSendParam = (action, name, value) => { form.loading(); window[action]([{ name, value }]); }
	const fnSendId = (action, value) => fnSendParam(action, "id", value);
	const fnSend = (action, data) => fnSendId(action, data.id);

	const rcView = data => {
		if (form.isCached(data.id))
			tabs.showTab("form"); // show form tab
		else
			fnSend("rcView", data); // call server action
		form.setCache(data.id); // filter form cache = xeco form cache
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

	const fnCallList = () => {
		setTimeout(form.loading, 1); // show loading after go new tab
		window.rcList(); // invoke list action to server
	}
	const fnList = (fEstado, fMiFirma) => { // prepare filter and call list action
		form.setData({ fEstado, fMiFirma}, ".ui-filter");//.setStrval("#fEstado", estado).setStrval("#fMiFirma", firma);
		fnCallList(); // invoke list action to server
	}
	const fnProcesando = data => { // avoid reclicks
		tblSolicitudes.refreshRow(model.setData(data).setProcesando());
		return self;
	}

	this.sendId = fnSendId;
	this.setSolicitudes = data => { tblSolicitudes.render(data); }

	this.init = () => {
		uxxiec.init(); // expediente uxxiec
		form.onKeydown(ev => ((ev.key == "Enter") && fnCallList()));
		const divSolicitudes = form.querySelector("#solicitudes-json");
		self.setSolicitudes(JSON.read(divSolicitudes?.innerHTML)); // preload data

		// Actions for solicitudes table
		tblSolicitudes.set("#rcView", rcView).set("#tab-reject", fnReject).set("#rcUxxiec", rcUxxiec);
		tblSolicitudes.set("#rcFirmar", data => (i18n.confirm("msgFirmar") && fnSend("rcFirmar", data)));
		tblSolicitudes.set("#rcReport", data => fnSend("rcReport", data));
		tblSolicitudes.set("#rcEmails", data => fnSend("rcEmails", data)); // admin test email
		tblSolicitudes.setRemove(data => !fnSend("rcRemove", data)); // remove true = confirm
		tblSolicitudes.set("#rcReactivar", data => (i18n.confirm("msgReactivar") && fnSend("rcReactivar", data)));
		tblSolicitudes.set("#rcIntegrar", data => (i18n.confirm("msgIntegrar") && fnProcesando(data) && fnSend("rcIntegrar", data))); // llamada al servidor
	}

	tabs.setInitEvent("list", () => (tblSolicitudes.isEmpty() && !form.getval("#fEstado") && fnList("", "5")));
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
			firmas.view(coll.parse(args.firmas)); // update firmas blocks
		fnProcesando(data); // avoid reclick
	}
}

export default new List();
