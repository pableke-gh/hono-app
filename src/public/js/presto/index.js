
import coll from "../components/CollectionHTML.js";
import tabs from "../components/Tabs.js";
import api from "../components/Api.js"

import presto from "./model/Presto.js";
import form from "./modules/presto.js";
import ButtonSave from "./components/buttons/ButtonSave.js";
import ButtonSubsanar from "./components/buttons/ButtonSubsanar.js";

coll.ready(() => { // init. presto modules
	form.init()
		.set("show-subtipo", () => (presto.isUae() && presto.isGcr()))
		.set("show-memoria", () => !presto.isL83()).set("is-adjunto", presto.getAdjunto);
	tabs.setAction("adjunto", () => api.init().blob("/uae/presto/adjunto?id=" + presto.getAdjunto()));
	tabs.show(presto.isUxxiec() ? "init" : "list"); // init view for PAS and list view for PDI

	// Init. form events
	const fnSync = ev => form.eachInput(".ui-ej", el => { el.value = ev.target.value; }); 
	const fnUrgente = ev => form.setVisible("[data-refresh='isUrgente']", ev.target.value == "2");
	form.addChange("urgente", fnUrgente).onChange(".ui-ej", fnSync);

	const DATA = {}; // build container
	DATA.ejercicios = form.getElement("ej").getValues(); // read current open years
	const fnBuild = (tipo, memo) => { DATA.solicitud = { tipo, memo }; return DATA; }; // build container befor view
	const fnCreate = (tipo, memo) => { delete DATA.partidas; return fnBuild(tipo, memo); }; // for: tcr, fce, l83, gcr and ant
	const fnCreateAfc = () => { DATA.partidas = [ DATA.fcb ]; form.create(fnBuild(8)); }  // set partida unica + view

	tabs.setAction("tcr", () => form.create(fnCreate(1))); // create TCR
	tabs.setAction("fce", () => form.create(fnCreate(6))); // create FCE
	tabs.setAction("l83", () => form.create(fnCreate(3, "Liquidación contrato artículo 83"))); // create L83
	tabs.setAction("gcr", () => form.create(fnCreate(4, "Generación de crédito electrónica"))); // create GCR
	tabs.setAction("ant", () => form.create(fnCreate(5))); // create ANT
	tabs.setAction("afc", () => { // create AFC
		if (DATA.fcb) // aplicación fondo de cobertura
			return fnCreateAfc(); // load view AFC
		api.init().json("/uae/presto/fcb").then(fcb => {
			DATA.fcb = fcb; // avoid extra calls
			fnCreateAfc(); // load view AFC
		});
	});
});

customElements.define("btn-save", ButtonSave, { extends: "button" });
customElements.define("btn-subsanar", ButtonSubsanar, { extends: "button" });
