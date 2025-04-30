
import coll from "../components/Collection.js";
import tabs from "../components/Tabs.js";

import iris from "./modules/iris.js";
import uxxiec from "./modules/uxxiec.js";
import perfil from "./modules/perfil/perfil.js";
import rutas from "./modules/rutas/rutas.js";
import gastos from "./modules/gastos/gastos.js"; 
import otri from "./modules/otri.js";

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
	iris.view(coll.parse(args.iris), coll.parse(args.firmas));
	perfil.view(coll.parse(args.interesado), coll.parse(args.organicas));
	rutas.setRutas(coll.parse(args.rutas) || []);
	gastos.setGastos(coll.parse(args.gastos) || []);
}

window.updateIrse = (xhr, status, args, tab) => {
	if (!window.showAlerts(xhr, status, args))
		return false; // show error alerts

	// update IRSE form
	iris.update(coll.parse(args.iris), coll.parse(args.firmas), tab);
	perfil.update(coll.parse(args.interesado));
	rutas.update(coll.parse(args.rutas));
	gastos.update(coll.parse(args.gastos));
}

/*********** subvención, congreso, asistencias/colaboraciones ***********/
tabs.setActiveEvent("isu", perfil.isIsu);
tabs.setInitEvent("isu", otri.init);

/*********** Expediente UXXI-EC ***********/
tabs.setInitEvent("uxxiec", uxxiec.init);
tabs.setViewEvent("uxxiec", uxxiec.load);
