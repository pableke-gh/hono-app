
import coll from "../components/CollectionHTML.js";
import tabs from "../components/Tabs.js";
import api from "../components/Api.js"
import i18n from "./i18n/langs.js";
import valid from "./i18n/validators.js";

import presto from "./model/Presto.js";
import form from "./modules/presto.js";

coll.ready(() => { // init. presto modules
	form.setValidators(valid)
		.set("show-subtipo", () => (presto.isUae() && presto.isGcr()))
		.set("show-memoria", () => !presto.isL83()).set("is-adjunto", presto.getAdjunto);
	form.onChangeFile("[name='adjunto']", (ev, el, file) => { el.nextElementSibling.innerHTML = file.name; });
	tabs.setAction("adjunto", () => api.init().blob("/uae/presto/adjunto?id=" + presto.getAdjunto()));

	// Init. form events
	const fnSync = ev => form.eachInput(".ui-ej", el => { el.value = ev.target.value; }); 
	const fnUrgente = ev => form.setVisible("[data-refresh='isUrgente']", ev.target.value == "2");
	form.onChangeInput("#urgente", fnUrgente).onChangeInputs(".ui-ej", fnSync);

	const DATA = {}; // build container
	api.init().fetch("/uae/presto/ejercicios").then(ejercicios => { DATA.ejercicios = ejercicios; }); // hide call
	const fnBuild = (tipo, memo) => { DATA.solicitud = { tipo, memo }; return DATA; }; // build container befor view
	const fnBuildAfc = () => { DATA.partidas = [ DATA.fcb ]; form.create(fnBuild(8)); }  // set partida unica + view

	tabs.setAction("tcr", () => form.create(fnBuild(1))); // create TCR
	tabs.setAction("fce", () => form.create(fnBuild(6))); // create FCE
	tabs.setAction("l83", () => form.create(fnBuild(3, "Liquidación contrato artículo 83"))); // create L83
	tabs.setAction("gcr", () => form.create(fnBuild(4, "Generación de crédito electrónica"))); // create GCR
	tabs.setAction("ant", () => form.create(fnBuild(5))); // create ANT
	tabs.setAction("afc", () => { // create AFC
		if (DATA.fcb) // aplicación fondo de cobertura
			return fnBuildAfc(); // load view AFC
		api.init().json("/uae/presto/fcb").then(fcb => {
			DATA.fcb = fcb; // avoid extra calls
			fnBuildAfc(); // load view AFC
		});
	});

	function fnValidate(msgConfirm, url) {
		const data = valid.all(); // validate form
		if (!data || !i18n.confirm(msgConfirm))
			return Promise.reject(); // Error al validar o sin confirmacion
		const include = [ "id", "tipo", "subtipo", "mask" ]; // fields to include
		const fd = form.getFormData(Object.assign(presto.getData(), data), include);
		fd.exclude([ "acOrgDec", "faDec", "ejInc", "acOrgInc", "faInc", "cd" ]);
		// primera partida = principal y serializo el json (FormData only supports flat values)
		fd.setJSON("partidas", form.getPartidas().setPrincipal().getData());
		return api.setFormData(fd).send(url); // send data
	}
	tabs.setAction("send", () => fnValidate("msgSend", "/uae/presto/save").then(tabs.showInit)); // send xeco-model form
	tabs.setAction("subsanar", () => fnValidate("msgSave", "/uae/presto/subsanar").then(tabs.showList)); // send from changes
	tabs.showTab(presto.isUxxiec() ? "init" : "list"); // Always init. list view for PAS/PDI
});
