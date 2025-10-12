
import coll from "../components/Collection.js";
import tabs from "../components/Tabs.js";
import i18n from "./i18n/langs.js";
import dom from "./lib/dom-box.js";

import irse from "./model/Irse.js";
import list from "./modules/list.js";
import perfil from "./modules/perfil.js";
import rutas from "./modules/rutas.js";
import dietas from "./modules/dietas.js";
import maps from "./modules/maps.js";
import otri from "./modules/otri.js";
import organicas from "./modules/organicas.js";
import iTabs from "./modules/tabs.js";
import xeco from "../xeco/xeco.js";

window.IRSE = {}; // global IRSE info
const formIrse = xeco.getForm();
coll.ready(list.init);

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

/*********** Fin + IBAN ***********/
tabs.setInitEvent(9, iTabs.initTab9); // init. all validations and inputs events only once
tabs.setViewEvent(9, organicas.build); // always auto build table organicas/gastos (transporte, pernoctas, dietas)

/*********** ASOCIAR RUTAS / GASTOS ***********/
tabs.setInitEvent(12, iTabs.initTab12); // init. all validations and inputs events only once

//PF needs confirmation in onclick attribute
/*window.fnFirmar = () => i18n.confirm("msgFirmar") && loading();
window.fnRechazar = () => dom.closeAlerts().required("#rechazo", "Debe indicar un motivo para el rechazo de la solicitud.").isOk() && i18n.confirm("msgRechazar");*/
window.isCached = (id, tab) => formIrse.isCached(id) && !perfil.isEmpty() && tabs.showTab(tab); // if cached avoid navegation
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
	xeco.getFirmas().view(coll.parse(args.firmas)); // update firmas view
	formIrse.setStrval("#idses", window.IRSE.id).setCache(window.IRSE.id).refresh(irse); // configure view
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
