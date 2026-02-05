
import coll from "../components/Collection.js";
import tabs from "../components/Tabs.js";
import api from "../components/Api.js";
import i18n from "./i18n/langs.js";
import valid from "./i18n/validators.js";
import dom from "./lib/dom-box.js";

import irse from "./model/Irse.js";
import perfil from "./modules/perfil.js";
import rutas from "./modules/rutas.js";
import dietas from "./modules/dietas.js";
import maps from "./modules/maps.js";
import otri from "./modules/otri.js";
import organicas from "./modules/organicas.js";
import iTabs from "./modules/tabs.js";
import list from "../xeco/modules/list.js";

window.IRSE = {}; // global IRSE info
coll.ready(() => {
	/*********** Redefine handlers and add extra actions ***********/
	const solicitudes = list.getList(); // solicitudes
	const form = list.init(irse).getForm(); // init. list
	const fnCached = id => (form.isCached(id) && !perfil.isEmpty()); // check if data is cached
	const fnIdParam = data => { loading(); return [{ name: "id", value: data.id }]; } // set param structure
	solicitudes.set("#view", data => (fnCached(data.id) ? tabs.showTab(irse.setData(data).getInitTab()) : window.rcView(fnIdParam(data))));
	solicitudes.set("#paso8", data => (i18n.confirm("msgReactivarP8") && api.init().json("/uae/iris/paso8?id=" + data.id))); // set table action
	solicitudes.set("#clone", data => (i18n.confirm("msgReactivar") && window.rcClone(fnIdParam(data)))); // set table action
	solicitudes.set("#rptFinalizar", data => api.init().text("/uae/iris/report/finalizar?id=" + data.id).then(api.html)); // html report
	//tabs.setAction("rptFinalizar", () => solicitudes.invoke("#rptFinalizar")); // set tab action

	/*********** campo objeto y mun ***********/
	tabs.setInitEvent(1, rutas.mun); // init. mun

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
		perfil.init(); rutas.init(); organicas.init(); // init modules

		form.setval("#idses", window.IRSE.id).setCache(window.IRSE.id)
			.setFirmas(coll.parse(args.firmas)).refresh(); // configure view
		tab = tab ?? window.IRSE.tab; // get next tab to show
		tabs.reset([ 0, 1, 3, 5, 6, 9 ]).load(form.getForm()); // reload tabs from server
		tabs.isActive(tab) ? tabs.setActive(tab) : tabs.nextTab(tab); // IMPORTANTE! tab5 autoreload tab
		window.showAlerts(xhr, status, args); // alerts
	}

	// Global initializations
	window.ip = perfil;
	window.ir = rutas;
	irse.getNumRutasVp = () => (!perfil.isEmpty() && rutas.getNumRutasVp()); // show / hide rutas con vehiculo propio

	// Hack old DomBox Module
	dom.confirm = i18n.confirm; // for remove action
	dom.getData = selector => form.getData(selector); // parse form data
	dom.isOk = () => (valid.isOk() || !form.setErrors(valid.getMsgs())); // update fields
	dom.isError = () => (valid.isError() && form.setErrors(valid.getMsgs())); // update fields
	dom.closeAlerts = () => { valid.reset(); form.closeAlerts(); return dom; } // reset msgs and alerts
	dom.showError = msg => { form.showError(msg); return dom; } // show message error
	dom.addError = dom.setError = (el, msg, msgtip) => {
		el = form.getInput(el); // check if input exists
		el && valid.addError(el.name, msgtip, msg); // set error message
		return dom;
	}
	dom.required = (el, msg) => {
		el = form.getInput(el);
		el && valid.size250(el.name, el.value, msg);
		return dom;
	}
	dom.intval = (el, msg) => {
		el = form.getInput(el);
		el && valid.le10(el.name, +el.value, msg);
		return dom;
	}
	dom.gt0 = (el, msg) => {
		el = form.getInput(el);
		el && valid.gt0(el.name, i18n.toFloat(el.value), msg);
		return dom;
	}
	dom.fk = (el, msg) => {
		el = form.getInput(el);
		el && valid.isKey(el.name, el.value, msg);
		return dom;
	}
	dom.past = (el, msg) => {
		el = form.getInput(el);
		el && valid.past(el.name, el.value, msg);
		return dom;
	}
	dom.leToday = (el, msg) => {
		el = form.getInput(el);
		el && valid.leToday(el.name, el.value, msg);
		return dom;
	}
	dom.geToday = (el, msg) => {
		el = form.getInput(el);
		el && valid.geToday(el.name, el.value, msg);
		return dom;
	}
});
