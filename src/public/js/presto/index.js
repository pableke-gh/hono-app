
import coll from "../components/CollectionHTML.js";
import tabs from "../components/Tabs.js";
import api from "../components/Api.js"
import i18n from "./i18n/langs.js";
import valid from "./i18n/validators.js";

import presto from "./model/Presto.js";
import form from "./modules/presto.js";

coll.ready(() => { // init. presto modules
	form.init()
		.set("show-subtipo", () => (presto.isUae() && presto.isGcr()))
		.set("show-memoria", () => !presto.isL83()).set("is-adjunto", presto.getAdjunto);
	form.getElement("adjunto").onFile((ev, el, file) => { el.nextElementSibling.innerHTML = file.name; });
	tabs.setAction("adjunto", () => api.init().blob("/uae/presto/adjunto?id=" + presto.getAdjunto()));
	tabs.show(presto.isUxxiec() ? "init" : "list"); // init view for PAS and list view for PDI

	// Init. form events
	const fnSync = ev => form.eachInput(".ui-ej", el => { el.value = ev.target.value; }); 
	const fnUrgente = ev => form.setVisible("[data-refresh='isUrgente']", ev.target.value == "2");
	form.addChange("urgente", fnUrgente).onChange(".ui-ej", fnSync);

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

	form.onSubmit(ev => {
		ev.preventDefault(); // no submitter
		const data = valid.all(); // validate form
		if (!data || !i18n.confirm(ev.submitter.dataset.confirm))
			return; // Error al validar o sin confirmacion

		const fd = form.getFormData(); // append all input values
		fd.load(presto.getData(), [ "id", "estado", "tipo", "mask", "codigo" ]); // set calculated fields
		fd.exclude([ "faDec", "cd", "ejInc", "orgInc", "faInc", "ecoInc", "impInc", "ej030", "org030", "eco030", "imp030" ]);
		// primera partida = principal y serializo el json (FormData only supports flat values)
		fd.setJSON("partidas", form.getPartidas().setPrincipal().getData());

		const fnThen = (ev.submitter.name == "save") ? tabs.showInit : tabs.showList;
		const url = "/uae/presto/" + ev.submitter.name; // button type
		api.setFormData(fd).send(url).then(fnThen); // send data
	});
});
