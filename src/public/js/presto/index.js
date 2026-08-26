
import coll from "../components/CollectionHTML.js";
import tabs from "../core/components/tabs/Tabs.js";
import api from "../core/components/Api.js"

import presto from "./model/Presto.js";
import form from "./modules/presto.js";

import Ejercicio from "./components/pDec/Ejercicio.js";
import ButtonSave from "./components/buttons/Save.js";
import ButtonFirmar from "./components/buttons/Firmar.js";
import ButtonRechazar from "./components/buttons/Rechazar.js";
import ButtonCancelar from "./components/buttons/Cancelar.js";
import ButtonSubsanar from "./components/buttons/Subsanar.js";
import ButtonReport from "./components/buttons/Report.js";
import ButtonRemove from "./components/buttons/Remove.js";
import MsgReject from "./components/MsgReject.js";

coll.ready(() => { // init. presto modules
	const DATA = {}; // build container
	DATA.ejercicios = form.init().getElement("ej").getValues(); // read current open years
	const fnBuild = (tipo, memo) => { DATA.solicitud = { tipo, memo }; return DATA; }; // build container befor view
	const fnCreate = (tipo, memo) => { delete DATA.partidas; return fnBuild(tipo, memo); }; // for: tcr, fce, l83, gcr and ant
	const fnCreateAfc = () => { DATA.partidas = [ DATA.fcb ]; form.create(fnBuild(8)); }  // set partida unica + view

	tabs.open(presto.isUxxiec() ? "init" : "list"); // set view for PAS / PDI
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

customElements.define("ej-dec", Ejercicio, { extends: "select" });
customElements.define("btn-save", ButtonSave, { extends: "button" });
customElements.define("btn-firmar", ButtonFirmar, { extends: "button" });
customElements.define("btn-rechazar", ButtonRechazar, { extends: "button" });
customElements.define("btn-cancelar", ButtonCancelar, { extends: "button" });
customElements.define("btn-subsanar", ButtonSubsanar, { extends: "button" });
customElements.define("btn-report", ButtonReport, { extends: "button" });
customElements.define("btn-remove", ButtonRemove, { extends: "button" });
customElements.define("msg-reject", MsgReject, { extends: "p" });
