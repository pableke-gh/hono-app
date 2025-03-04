
import coll from "../components/Collection.js";
import tabs from "../components/Tabs.js";
import pf from "../components/Primefaces.js";

import iris from "./modules/iris.js";
import list from "./modules/list.js";
import uxxiec from "./modules/uxxiec.js";
import perfil from "./modules/perfil.js";
import rutas from "./modules/rutas.js";
import gastos from "./modules/gastos.js"; 
import dietas from "./modules/dietas.js"; 
import firmas from "./modules/firmas.js";
import otri from "./modules/otri.js";

window.IRSE = {}; // global IRSE info
pf.ready(list.init);

/*********** PERFIL MUN tab-1 ***********/ 
tabs.setInitEvent(1, rutas.mun);
tabs.setInitEvent(1, tab => { tab.querySelectorAll(".block-mun").toggle("hide", !perfil.isMun()); });

/*********** Google Maps API ***********/
tabs.setActiveEvent("maps", perfil.isTrayectos);
tabs.setInitEvent("maps", rutas.maps);
tabs.setViewEvent("maps", tabs.resetToggleAction);

/*********** subvención, congreso, asistencias/colaboraciones ***********/
tabs.setActiveEvent("isu", perfil.isIsu);
tabs.setInitEvent("isu", otri.init);

/*********** FACTURAS, TICKETS y demás DOCUMENTACIÓN para liquidar ***********/
tabs.setViewEvent(5, gastos.initTab5);

/*********** Tablas de resumen ***********/
tabs.setInitEvent(6, dietas.init); 

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
	perfil.init().setOrganicas(coll.parse(args.organicas));
	rutas.init().setRutas(coll.parse(args.rutas) || []);
	gastos.init().setGastos(coll.parse(args.gastos));
	firmas.init(coll.parse(args.firmas));
	//organicas.init();
	iris.init();
	tabs.nextTab(tab ?? IRSE.tab); // go to next tab
}
window.updateIrse = (xhr, status, args, tab) => {
	if (!pf.showAlerts(xhr, status, args))
		return; // show alerts

	// update IRSE form
	let data = coll.parse(args.organicas);
	data && perfil.setOrganicas(data);
	data = coll.parse(args.gastos);
	data && gastos.setGastos(data);
	data = coll.parse(args.firmas);
	data && firmas.setFirmas(data);
	iris.update(); // update inputs
	if (tab && tabs.isActive(tab))
		window.saveTab(); // show ok msg
	else
		tabs.nextTab(tab); // go to next tab
	return true;
}
