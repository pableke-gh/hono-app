
import coll from "../components/Collection.js";
import tabs from "../components/Tabs.js";
import pf from "../components/Primefaces.js";

import iris from "./modules/iris.js";
import resumen from "./modules/resumen.js"; 
import list from "./modules/list.js";
import uxxiec from "./modules/uxxiec.js";
import perfil from "./modules/perfil/perfil.js";
import rutas from "./modules/rutas/rutas.js";
import gastos from "./modules/gastos/gastos.js"; 
import firmas from "../xeco/modules/firmas.js";
import otri from "./modules/otri.js";

window.IRSE = {}; // global IRSE info
pf.ready(list.init);

/*********** Update perfil after step-0 ***********/
tabs.setViewEvent(1, perfil.refresh);

/*********** Google Maps API ***********/
tabs.setActiveEvent("maps", perfil.isTrayectos);
tabs.setInitEvent("maps", rutas.maps);
//tabs.setViewEvent("maps", tabs.resetToggleAction);

/*********** subvención, congreso, asistencias/colaboraciones ***********/
tabs.setActiveEvent("isu", perfil.isIsu);
tabs.setInitEvent("isu", otri.init);

/*********** FACTURAS, TICKETS y demás DOCUMENTACIÓN para liquidar ***********/
tabs.setViewEvent(5, gastos.initTab5);

/*********** Tablas de resumen ***********/
tabs.setInitEvent("resumen", resumen.init); 
tabs.setViewEvent("resumen", resumen.view); 

/*********** Expediente UXXI-EC ***********/
tabs.setInitEvent("uxxiec", uxxiec.init);
tabs.setViewEvent("uxxiec", uxxiec.load);

window.viewIrse = (xhr, status, args, tab) => {
	if (!pf.showAlerts(xhr, status, args))
		return; // show alerts

	tabs.setActions(document); // load new tabs
	Object.assign(IRSE, coll.parse(args.data)); // update server info
	IRSE.editable = !IRSE.id || (IRSE.estado == 6); // solicitud editable

	// Init IRSE form
	perfil.init().setOrganicas(coll.parse(args.organicas));
	rutas.init().setRutas(coll.parse(args.rutas) || []);
	gastos.init().setGastos(coll.parse(args.gastos) || []);
	firmas.setFirmas(coll.parse(args.firmas));
	iris.init();
	tabs.nextTab(tab ?? IRSE.tab); // go to next tab
}
window.updateIrse = (xhr, status, args, tab) => {
	if (!pf.showAlerts(xhr, status, args))
		return; // show alerts

	// update IRSE form
	perfil.update(coll.parse(args.organicas));
	let data = coll.parse(args.rutas);
	data && rutas.setRutas(data);
	data = coll.parse(args.gastos);
	data && gastos.setGastos(data);
	data = coll.parse(args.firmas);
	data && firmas.setFirmas(data);
	iris.update(); // update inputs
	tabs.setActions(document); // load new tabs
	if (tab && tabs.isActive(tab))
		window.saveTab(); // show ok msg
	else
		tabs.nextTab(tab); // go to next tab
	return true;
}
