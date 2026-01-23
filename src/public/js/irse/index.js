
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
import list from "../xeco/modules/SolicitudesList.js";

window.IRSE = {}; // global IRSE info
coll.ready(() => {
	/*********** Redefine handlers and add extra actions ***********/
	const form = list.init(irse).getForm(); // init. list
	const fnIdParam = data => { loading(); return [{ name: "id", value: data.id }]; } // set param structure
	list.set("#view", data => (irse.eq(data.id) && !perfil.isEmpty()) ? tabs.showTab(irse.setData(data).getInitTab()) : window.rcView(fnIdParam(data)));
	list.set("#paso8", data => (i18n.confirm("msgReactivarP8") && api.init().json("/uae/iris/paso8?id=" + data.id))); // set table action
	list.set("#clone", data => (i18n.confirm("msgReactivar") && window.rcClone(fnIdParam(data)))); // set table action
	list.set("#rptFinalizar", data => api.init().text("/uae/iris/report/finalizar?id=" + data.id).then(api.html)); // html report
	tabs.setAction("rptFinalizar", () => list.invoke("#rptFinalizar")); // set tab action

	/*********** Google Maps API ***********/
	tabs.setActiveEvent(2, perfil.isMaps).setInitEvent(2, maps);

	/*********** subvención, congreso, asistencias/colaboraciones ***********/
	tabs.setActiveEvent(3, perfil.isIsu).setInitEvent(3, otri.init);

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
	window.saveTab = () => form.showOk(i18n.get("saveOk")).working();
	window.viewIrse = (xhr, status, args, tab) => {
		irse.setData(Object.assign(window.IRSE, coll.parse(args.data)));
		dom.setTables(form.init().getForm()).setInputs(form.getElements());
		perfil.init(form); // perfil de la solicitud
		rutas.init(form); // rutas asociadas a la solicitud
		organicas.init(form); // tabla de organicas
		form.setval("#idses", window.IRSE.id).setFirmas(coll.parse(args.firmas)).refresh(irse); // configure view
		tabs.reset([0, 1, 3, 5, 6, 9, 12]).load(form.getForm()).nextTab(tab ?? window.IRSE.tab); // reload tabs
		window.showAlerts(xhr, status, args); // alerts
	}

	//Global IRSE components
	window.ip = perfil;
	window.ir = rutas;

	// Hack old DomBox Module
	dom.confirm = i18n.confirm; // for remove action
	dom.getData = selector => form.getData(selector); // parse form data
	dom.isOk = () => (i18n.getValidation().isOk() || !form.setErrors()); // update fields
	dom.isError = () => (i18n.getValidation().isError() && form.setErrors()); // update fields
	dom.closeAlerts = () => { i18n.getValidators(); form.closeAlerts(); return dom; } // reset msgs and alerts
	dom.showError = msg => { form.showError(msg); return dom; } // show message error
	dom.addError = dom.setError = (el, msg, msgtip) => {
		el = form.getInput(el); // check if input exists
		el && i18n.getValidation().addError(el.name, msgtip, msg); // set error message
		return dom;
	}
	dom.required = (el, msg) => {
		el = form.getInput(el);
		el && i18n.getValidation().size250(el.name, el.value, msg);
		return dom;
	}
	dom.intval = (el, msg) => {
		el = form.getInput(el);
		el && i18n.getValidation().le10(el.name, +el.value, msg);
		return dom;
	}
	dom.gt0 = (el, msg) => {
		el = form.getInput(el);
		el && i18n.getValidation().gt0(el.name, i18n.toFloat(el.value), msg);
		return dom;
	}
	dom.fk = (el, msg) => {
		el = form.getInput(el);
		el && i18n.getValidation().isKey(el.name, el.value, msg);
		return dom;
	}
	dom.past = (el, msg) => {
		el = form.getInput(el);
		el && i18n.getValidation().past(el.name, el.value, msg);
		return dom;
	}
	dom.leToday = (el, msg) => {
		el = form.getInput(el);
		el && i18n.getValidation().leToday(el.name, el.value, msg);
		return dom;
	}
	dom.geToday = (el, msg) => {
		el = form.getInput(el);
		el && i18n.getValidation().geToday(el.name, el.value, msg);
		return dom;
	}
});
