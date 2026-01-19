
import coll from "../components/Collection.js";
import tabs from "../components/Tabs.js";
import api from "../components/Api.js";
import i18n from "./i18n/langs.js";
import dom from "./lib/dom-box.js";

import irse from "./model/Irse.js";
import perfil from "./modules/perfil.js";
import rutas from "./modules/rutas.js";
import dietas from "./modules/dietas.js";
import maps from "./modules/maps.js";
import otri from "./modules/otri.js";
import organicas from "./modules/organicas.js";
import iTabs from "./modules/tabs.js";
import SolicitudesList from "../xeco/modules/SolicitudesList.js";

window.IRSE = {}; // global IRSE info
coll.ready(() => {
	const sl = new SolicitudesList(irse);
	const sf = sl.init().getForm();
	const formIrse = sf.getForm();
	i18n.set("fCache", (new Date()).addDays(-1).toISOString()); // fecha de la cache

	/*********** Redefine handlers and add extra actions ***********/
	const table = sl.getTable(); // Current table of solicitudes
	const fnIdParam = data => { loading(); return [{ name: "id", value: data.id }]; }
	const fnCached = (id, tab) => formIrse.isCached(id) && !perfil.isEmpty() && tabs.showTab(tab); // if cached avoid navegation
	table.set("#view", data => (fnCached(data.id, irse.setData(data).getInitTab()) || window.rcView(fnIdParam(data)))); // set table action
	table.set("#paso8", data => (i18n.confirm("msgReactivarP8") && api.init().json("/uae/iris/paso8?id=" + data.id))); // set table action
	table.set("#clone", data => (i18n.confirm("msgReactivar") && window.rcClone(fnIdParam(data)))); // set table action
	table.set("#rptFinalizar", data => api.init().text("/uae/iris/report/finalizar?id=" + data.id).then(api.html)); // html report
	tabs.setAction("rptFinalizar", () => table.invoke("#rptFinalizar")); // set tab action

	/*********** Google Maps API ***********/
	const fnTabActive = tab => !tab.classList.contains("tab-excluded")
	tabs.setActiveEvent(2, fnTabActive);
	tabs.setInitEvent(2, maps);

	/*********** subvención, congreso, asistencias/colaboraciones ***********/
	tabs.setActiveEvent(3, fnTabActive);
	tabs.setInitEvent(3, otri.init);

	/*********** FACTURAS, TICKETS y demás DOCUMENTACIÓN para liquidar ***********/
	tabs.setViewEvent(5, iTabs.viewTab5);

	/*********** Tablas de resumen ***********/
	tabs.setViewEvent(6, dietas.render);
	// download iris-facturas.zip / iris-doc.zip
	tabs.setAction("zip-com", () => api.init().blob("/uae/iris/zip/com", "iris-facturas.zip"));
	tabs.setAction("zip-doc", () => api.init().blob("/uae/iris/zip/doc", "iris-doc.zip"));

	/*********** Fin + IBAN ***********/
	tabs.setInitEvent(9, iTabs.initTab9); // init. all validations and inputs events only once
	tabs.setViewEvent(9, organicas.build); // always auto build table organicas/gastos (transporte, pernoctas, dietas)

	/*********** ASOCIAR RUTAS / GASTOS ***********/
	tabs.setInitEvent(12, iTabs.initTab12); // init. all validations and inputs events only once

	//PF needs confirmation in onclick attribute
	window.fnUnlink = () => i18n.confirm("unlink") && loading();
	window.saveTab = () => formIrse.showOk(i18n.get("saveOk")).working();

	window.viewIrse = (xhr, status, args, tab) => {
		tabs.load(document); // load new tabs
		irse.init(Object.assign(window.IRSE, coll.parse(args.data)));

		// Init. IRSE form, tables and inputs
		dom.setTables(formIrse.update().getForm())
			.setInputs(formIrse.getElements());
		perfil.init(formIrse); // perfil de la solicitud
		rutas.init(formIrse); // rutas asociadas a la solicitud
		organicas.init(formIrse); // tabla de organicas
		sf.setFirmas(coll.parse(args.firmas)); // update firmas view
		formIrse.setval("#idses", window.IRSE.id).setCache(window.IRSE.id).refresh(irse); // configure view
		tabs.nextTab(tab ?? window.IRSE.tab); // go to next tab
		window.showAlerts(xhr, status, args); // alerts
	}

	//Global IRSE components
	window.ip = perfil;
	window.ir = rutas;

	// Hack old DomBox Module
	dom.confirm = i18n.confirm; // for remove action
	dom.getData = selector => formIrse.getData(selector); // parse form data
	dom.isOk = () => (i18n.getValidation().isOk() || !formIrse.setErrors()); // update fields
	dom.isError = () => (i18n.getValidation().isError() && formIrse.setErrors()); // update fields
	dom.closeAlerts = () => { i18n.getValidators(); formIrse.closeAlerts(); return dom; } // reset msgs and alerts
	dom.showError = msg => { formIrse.showError(msg); return dom; } // show message error
	dom.addError = dom.setError = (el, msg, msgtip) => {
		el = formIrse.getInput(el); // check if input exists
		el && i18n.getValidation().addError(el.name, msgtip, msg); // set error message
		return dom;
	}
	dom.required = (el, msg) => {
		el = formIrse.getInput(el);
		el && i18n.getValidation().size250(el.name, el.value, msg);
		return dom;
	}
	dom.intval = (el, msg) => {
		el = formIrse.getInput(el);
		el && i18n.getValidation().le10(el.name, +el.value, msg);
		return dom;
	}
	dom.gt0 = (el, msg) => {
		el = formIrse.getInput(el);
		el && i18n.getValidation().gt0(el.name, i18n.toFloat(el.value), msg);
		return dom;
	}
	dom.fk = (el, msg) => {
		el = formIrse.getInput(el);
		el && i18n.getValidation().isKey(el.name, el.value, msg);
		return dom;
	}
	dom.past = (el, msg) => {
		el = formIrse.getInput(el);
		el && i18n.getValidation().past(el.name, el.value, msg);
		return dom;
	}
	dom.leToday = (el, msg) => {
		el = formIrse.getInput(el);
		el && i18n.getValidation().leToday(el.name, el.value, msg);
		return dom;
	}
	dom.geToday = (el, msg) => {
		el = formIrse.getInput(el);
		el && i18n.getValidation().geToday(el.name, el.value, msg);
		return dom;
	}
});
