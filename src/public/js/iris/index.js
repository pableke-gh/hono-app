
import coll from "../components/Collection.js";
import tabs from "../components/Tabs.js";
import pf from "../components/Primefaces.js";

import iris from "./modules/iris.js";
import list from "./modules/list.js";
import uxxiec from "./modules/uxxiec.js";
import perfil from "./modules/perfil.js";
import maps from "./modules/maps.js";
import rutas from "./modules/rutas.js";
import gastos from "./modules/gastos.js"; 
import dietas from "./modules/dietas.js";
import otri from "./modules/otri.js";

window.IRSE = {}; // global IRSE info
pf.ready(list.init);

/*********** Google Maps API ***********/
tabs.setActiveEvent(2, perfil.isTrayectos);
tabs.setInitEvent(2, maps.init);
tabs.setViewEvent(2, tabs.resetToggleAction);

/*********** subvención, congreso, asistencias/colaboraciones ***********/
tabs.setActiveEvent(3, perfil.isIsu);
tabs.setInitEvent(3, otri.init);

/*********** FACTURAS, TICKETS y demás DOCUMENTACIÓN para liquidar ***********/
tabs.setViewEvent(5, gastos.initTab5);

/*********** Expediente UXXI-EC ***********/
tabs.setInitEvent("uxxiec", uxxiec.init);
tabs.setViewEvent("uxxiec", uxxiec.load);

window.viewIrse = (xhr, status, args, tab) => {
	if (!pf.showAlerts(xhr, status, args))
		return; // show alerts

	tabs.load(document); // load new tabs
	Object.assign(IRSE, coll.parse(args.data)); // update server info
	IRSE.editable = !IRSE.id || (IRSE.estado == 6); // solicitud editable

	// Init IRSE form
	perfil.init();
	rutas.init();
	gastos.init();
	dietas.init();
	//organicas.init();
	iris.init();
	tabs.nextTab(tab ?? IRSE.tab); // go to next tab
}
window.updateIrse = (xhr, status, args, tab) => {
	if (!pf.showAlerts(xhr, status, args))
		return; // show alerts

	// update IRSE form
	iris.update(); // update inputs
	tabs.nextTab(tab); // go to next tab
}
