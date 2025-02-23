
import coll from "../components/Collection.js";
import Form from "../components/Form.js";
import tabs from "../components/Tabs.js";
import pf from "../components/Primefaces.js";
//import i18n from "../i18n/langs.js";

import list from "./modules/list.js";
import uxxiec from "./modules/uxxiec.js";
import Perfil from "./modules/Perfil.js";
import maps from "./modules/maps.js";
import Rutas from "./modules/Rutas.js";
import Gastos from "./modules/Gastos.js"; 
import Dietas from "./modules/Dietas.js";

window.IRSE = {}; // global IRSE info
const formIrse = new Form("#xeco-irse");
const perfil = new Perfil(formIrse);
const rutas = new Rutas(formIrse);
const gastos = new Gastos(formIrse);
const dietas = new Dietas(formIrse);
pf.ready(list.init);

/*********** Google Maps API ***********/
tabs.setInitEvent(2, maps.init);
tabs.setViewEvent(2, tabs.resetToggleAction);

/*********** FACTURAS, TICKETS y demás DOCUMENTACIÓN para liquidar ***********/
tabs.setViewEvent(5, gastos.initTab5);

/*********** Tablas de resumen ***********/
//tabs.setViewEvent(6, dietas.render);

/*********** Expediente UXXI-EC ***********/
tabs.setInitEvent("uxxiec", () => uxxiec.init(formIrse));
tabs.setViewEvent("uxxiec", uxxiec.load);

/*********** View Actions ***********/
window.validateP0 = () => formIrse.validate(perfil.validate);
window.validateP1 = () => formIrse.validate(rutas.validateP1);
window.validateMun = () => formIrse.validate(rutas.validateMun);
window.validateP2 = () => formIrse.validate(rutas.validate);
window.validateP5 = () => formIrse.validate(gastos.validate); 
window.fnRemove = () => i18n.confirm("removeCom") && loading();
window.isCached = (id, tab) => (formIrse.isCached(id) && tabs.showTab(tab)); // if cached avoid navegation
window.saveTab = () => formIrse.showOk(i18n.get("saveOk")).working();

window.viewIrse = (xhr, status, args, tab) => {
	tabs.load(document); // load new tabs
	Object.assign(IRSE, coll.parse(args.data)); // update server info
	IRSE.editable = !IRSE.id || (IRSE.estado == 6); // solicitud editable

	// Init IRSE form
	formIrse.update().render(".i18n-tr-h1").setCache(IRSE.id); // current cache id
	perfil.init();
	rutas.init();
	gastos.init();
	//organicas.init(formIrse);

	tabs.nextTab(tab ?? IRSE.tab); // go to next tab
	pf.showAlerts(xhr, status, args); // show alerts
}
window.updateIrse = (xhr, status, args, tab) => {
	if (!pf.showAlerts(xhr, status, args))
		return; // show alerts
	formIrse.reset(".ui-json"); // clean inputs
	tabs.nextTab(tab); // go to next tab
}
