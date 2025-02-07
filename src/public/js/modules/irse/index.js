
import coll from "../../components/Collection.js";
import Form from "../../components/Form.js";
import tabs from "../../components/Tabs.js";
import pf from "../../components/Primefaces.js";
import i18n from "../../i18n/langs.js";
import dom from "../../lib/uae/dom-box.js";

import list from "./list.js";
import uxxiec from "./uxxiec.js";
import perfil from "./perfil.js";
import rutas from "./rutas.js";
import dietas from "./dietas.js";
import maps from "./maps.js";
import otri from "./otri.js";
import organicas from "./organicas.js";
import { viewTab5, initTab9, initTab12 } from "./tabs.js";

const formIrse = new Form("#xeco-irse");
pf.ready(list.init);

/*********** Google Maps API ***********/
tabs.setInitEvent(2, maps);

/*********** subvención, congreso, asistencias/colaboraciones ***********/
tabs.setInitEvent(3, () => otri.init(formIrse));

/*********** FACTURAS, TICKETS y demás DOCUMENTACIÓN para liquidar ***********/
tabs.setViewEvent(5, tab5 => viewTab5(tab5, formIrse));

/*********** Tablas de resumen ***********/
tabs.setViewEvent(6, dietas.render);

/*********** Fin + IBAN ***********/
tabs.setInitEvent(9, tab9 => initTab9(tab9, formIrse)); // init. all validations and inputs events only once
tabs.setViewEvent(9, organicas.build); // always auto build table organicas/gastos (transporte, pernoctas, dietas)

/*********** ASOCIAR RUTAS / GASTOS ***********/
tabs.setInitEvent(12, tab12 => initTab12(tab12, formIrse)); // init. all validations and inputs events only once

/*********** Expediente UXXI-EC ***********/
tabs.setInitEvent("uxxiec", () => uxxiec.init(formIrse));
tabs.setViewEvent("uxxiec", uxxiec.load);

//PF needs confirmation in onclick attribute
window.fnFirmar = () => i18n.confirm("msgFirmar") && loading();
window.fnRechazar = () => dom.closeAlerts().required("#rechazo", "Debe indicar un motivo para el rechazo de la solicitud.").isOk() && i18n.confirm("msgRechazar");
window.fnIntegrar = link => i18n.confirm("msgIntegrar") && loading() && link.hide().closest("tr").querySelectorAll(".estado").text("Procesando...");
window.isCached = (id, tab) => formIrse.isCached(id) && !perfil.empty() && tabs.showTab(tab); // if cached avoid navegation
window.fnRemove = () => i18n.confirm("removeCom") && loading();
window.fnUnlink = () => i18n.confirm("unlink") && loading();
window.fnClone = () => i18n.confirm("reactivar") && loading();
window.saveTab = () => formIrse.showOk(i18n.get("saveOk")).working();

// Handle errors or parse server messages
window.showNextTab = window.showTab;
window.viewTab = tabs.showTab;
window.viewIrse = (xhr, status, args, tab) => {
	tabs.load(document); // load new tabs
	Object.assign(IRSE, coll.parse(args.data)); // update server info

	// Init IRSE form
	dom.setTables(formIrse.getForm()).setInputs(formIrse.getElements()); // Update tables and inputs
	formIrse.update().render(".i18n-tr-h1").readonly(true, ".ui-state-disabled").setCache(IRSE.id); // current cache id
	perfil.init(formIrse);
	rutas.init(formIrse);
	organicas.init(formIrse);
	tabs.nextTab(tab ?? IRSE.tab); // go to next tab
	pf.showAlerts(xhr, status, args); // show alerts
}

//Global IRSE components
window.ip = perfil;
window.ir = rutas;
window.io = organicas;

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
/*dom.login = (el, msg) => {
	el = formIrse.getInput(el);
	el && i18n.getValidation().isLogin(el.name, el.value, msg);
	return dom;
}
dom.email = (el, msg) => {
	el = formIrse.getInput(el);
	el && i18n.getValidation().isEmail(el.name, el.value, msg);
	return dom;
}*/
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
