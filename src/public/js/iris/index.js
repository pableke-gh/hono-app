
import coll from "../components/Collection.js";
import tabs from "../components/Tabs.js";

import iris from "./modules/iris.js";
import resumen from "./modules/resumen.js"; 
import uxxiec from "./modules/uxxiec.js";
import perfil from "./modules/perfil/perfil.js";
import rutas from "./modules/rutas/rutas.js";
import gastos from "./modules/gastos/gastos.js"; 
import otri from "./modules/otri.js";

window.IRSE = {};
coll.ready(() => {
	iris.init();
	perfil.init();
	rutas.init();
	gastos.init();
});

window.viewIrse = (xhr, status, args) => {
	if (!window.showAlerts(xhr, status, args))
		return false; // show error alerts

	// Init IRSE form
	const data = coll.parse(args.iris);
	iris.view(data, coll.parse(args.firmas));
	perfil.view(data, coll.parse(args.interesado), coll.parse(args.organicas));
	rutas.setRutas(coll.parse(args.rutas) || []);
	gastos.setGastos(coll.parse(args.gastos) || []);
}

window.updateIrse = (xhr, status, args, tab) => {
	if (!window.showAlerts(xhr, status, args))
		return false; // show error alerts

	// update IRSE form
	const data = coll.parse(args.iris); // get irse data
	iris.update(data, coll.parse(args.firmas), tab); // update inputs
	perfil.update(coll.parse(args.interesado));
	rutas.update(coll.parse(args.rutas));
	gastos.update(coll.parse(args.gastos));
}

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
