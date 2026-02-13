
import coll from "../components/Collection.js";
import tabs from "../components/Tabs.js";
import api from "../components/Api.js";
import i18n from "./i18n/langs.js";
import valid from "./i18n/validators.js";
import dom from "./lib/dom-box.js";

import irse from "./model/Irse.js";
import perfil from "./modules/perfil.js";
import paso1 from "./modules/paso1.js";
import rutas from "./modules/rutas.js";
import maps from "./modules/maps.js";
import paso5 from "./modules/paso5.js";
import dietas from "./modules/dietas.js";
import paso9 from "./modules/paso9.js";
import organicas from "./modules/tables/organicas.js";
import otri from "./modules/otri.js";
import form from "./modules/irse.js";

window.IRSE = {}; // global IRSE info
coll.ready(() => {
	/*********** Global modules ***********/
	window.ip = perfil.init(); window.ir = rutas.init();

	/*********** campo objeto y mun ***********/
	tabs.setInitEvent(1, paso1.mun); // init. mun

	/*********** Google Maps API ***********/
	tabs.setActiveEvent(2, perfil.isMaps).setInitEvent(2, maps);

	/*********** subvención, congreso, asistencias/colaboraciones ***********/
	tabs.setActiveEvent(3, perfil.isIsu).setInitEvent(3, otri.init);

	/*********** Tablas de resumen ***********/
	tabs.setViewEvent(6, dietas.render);
	// download iris-facturas.zip / iris-doc.zip
	tabs.setAction("zip-com", () => api.init().blob("/uae/iris/zip/com", "iris-facturas.zip"));
	tabs.setAction("zip-doc", () => api.init().blob("/uae/iris/zip/doc", "iris-doc.zip"));

	/*********** Fin + IBAN ***********/
	tabs.setInitEvent(9, paso9.initTab); // init. all validations and inputs events only once
	tabs.setViewEvent(9, organicas.render); // always auto build table organicas/gastos (transporte, pernoctas, dietas)

	//PF needs confirmation in onclick attribute
	window.fnUnlink = () => i18n.confirm("unlink") && loading();
	window.saveTab = () => form.showOk(i18n.msg("saveOk")).working();
	window.viewIrse = (xhr, status, args, tab) => {
		irse.setData(Object.assign(window.IRSE, coll.parse(args.data)));
		dom.setTables(form.init().getForm()).setInputs(form.getElements());
		perfil.view(); rutas.view(); paso5.view(); // init modules

		form.setValidators(valid)
			.setval("#idses", window.IRSE.id).setCache(window.IRSE.id)
			.setFirmas(coll.parse(args.firmas)).refresh(irse); // configure view
		tabs.reset([ 0, 1, 3, 6, 9 ]).load(form.getForm()); // reload tabs from server
		tabs.nextTab(tab ?? window.IRSE.tab); // go to next tab
		window.showAlerts(xhr, status, args); // alerts
	}

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
