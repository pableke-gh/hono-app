
import coll from "../components/Collection.js";
import tabs from "../components/Tabs.js";

import iris from "./modules/iris.js";
import perfil from "./modules/perfil/perfil.js";
import rutas from "./modules/rutas/rutas.js";
import gastos from "./modules/gastos/gastos.js"; 
import resumen from "./modules/resumen.js";
import sendTab from "./modules/send.js";
import otri from "./modules/otri.js";
import listIsu from "./modules/isu/list.js";

coll.ready(() => {
	iris.init();
	perfil.init();
	rutas.init();
	gastos.init();

	otri.init();
	resumen.init();
	sendTab.init();
});

window.viewIrse = (xhr, status, args) => {
	if (!window.showAlerts(xhr, status, args))
		return false; // show error alerts

	// Init IRSE form
	iris.view(coll.parse(args.iris), coll.parse(args.firmas));
	perfil.view(coll.parse(args.interesado), coll.parse(args.organicas));
	rutas.setRutas(coll.parse(args.rutas) || []);
	gastos.setGastos(coll.parse(args.gastos) || []);

	otri.view(); // paso 3 = isu
	resumen.view(); // update tables for paso 6
	sendTab.view(coll.parse(args.cuentas));
}

window.updateIrse = (xhr, status, args, tab) => {
	if (!window.showAlerts(xhr, status, args))
		return false; // show error alerts

	// update IRSE form
	iris.update(coll.parse(args.iris), coll.parse(args.firmas), tab);
	perfil.update(coll.parse(args.interesado));
	rutas.update(coll.parse(args.rutas));
	gastos.update(coll.parse(args.gastos));

	//otri.update(); // paso 3 = isu
	resumen.update(); // update tables for paso 6
	sendTab.update(coll.parse(args.cuentas));
}

/*********** Listado ISU - Justifi OTRI ***********/
tabs.setInitEvent("listIsu", listIsu.init);
