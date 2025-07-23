
import coll from "../components/CollectionHTML.js";
import tabs from "../components/Tabs.js";
import api from "../components/Api.js"
import i18n from "../i18n/langs.js";

import presto from "./model/Presto.js";
import pDec from "./modules/partidaDec.js";
import pInc from "./modules/partidaInc.js";
import xeco from "../xeco/xeco.js";

coll.ready(() => {
	// init. modules actions
	xeco.init(); pDec.init(); pInc.init();

	const form = xeco.getForm();
	form.set("show-partida-dec", presto.isPartidaDec).set("show-imp-cd", presto.isImpCd)
		.set("show-partida-inc", presto.showPartidasInc).set("show-memoria", () => !presto.isL83())
		.set("is-fce", presto.isFce).set("is-urgente", presto.isUrgente)
		.set("show-subtipo", () => (presto.isUae() && presto.isGcr()));

	// Init. form events
	const fnSync = ev => form.eachInput(".ui-ej", el => { el.value = ev.target.value; }); 
	const fnUrgente = ev => form.setVisible("[data-refresh='is-urgente']", ev.target.value == "2");
	form.onChangeInput("#urgente", fnUrgente).onChangeInputs(".ui-ej", fnSync);

	presto.view = data => {
		data.presto.adjunto = data.adjunto; // sync adjunto
		form.setLabels("select.ui-ej", data.ejercicios); // update field values
		xeco.view(data.presto, data.firmas); // load data-model before view
		pDec.view(data.presto, data.economicas); // vista de la partida a decrementar
		pInc.view(data.partidas); // cargo la tabla de partidas a incrementar
	}

	const DATA = {}; // build container
	api.init().fetch("/uae/presto/ejercicios").then(ejercicios => { DATA.ejercicios = ejercicios; }); // hide call
	const fnBuild = (tipo, memo) => { DATA.presto = { tipo, memo }; return DATA; }; // build container befor view
	const fnBuildAfc = () => { DATA.partidas = [ DATA.fcb ]; presto.view(fnBuild(8)); }  // set partida unica + view

	tabs.setAction("tcr", () => presto.view(fnBuild(1))); // create TCR
	tabs.setAction("fce", () => presto.view(fnBuild(6))); // create FCE
	tabs.setAction("l83", () => presto.view(fnBuild(3, "Liquidación contrato artículo 83"))); // create L83
	tabs.setAction("gcr", () => presto.view(fnBuild(4, "Generación de crédito electrónica"))); // create GCR
	tabs.setAction("ant", () => presto.view(fnBuild(5))); // create ANT
	tabs.setAction("afc", () => { // create AFC
		if (DATA.fcb) // aplicación fondo de cobertura
			return fnBuildAfc(); // load view AFC
		api.init().json("/uae/presto/fcb").then(fcb => {
			DATA.fcb = fcb; // avoid extra calls
			fnBuildAfc(); // load view AFC
		});
	});

	function fnValidate(msgConfirm, url, tab) {
		const data = form.validate(presto.validate);
		if (!data || !i18n.confirm(msgConfirm))
			return false; // Errores al validar o sin confirmacion
		Object.clear(data, [ "acOrgDec", "faDec", "ejInc", "acOrgInc", "faInc", "cd" ]); // clear info fields
		const temp = Object.assign(presto.getData(), data); // merge data to send
		temp.partidas = presto.getPartidas().setPrincipal().getData(); // primera partida = principal
		return api.setJSON(temp).json(url).then(msgs => tabs.showMsgs(msgs, tab)); // send data
	}
	tabs.setAction("send", () => fnValidate("msgSend", "/uae/presto/save", "init")); // send xeco-model form
	tabs.setAction("subsanar", () => fnValidate("msgSave", "/uae/presto/subsanar", "list")); // send from changes
	tabs.showTab(presto.isUxxiec() ? "init" : "list"); // Always init. list view for PAS/PDI
});
