
import coll from "../components/Collection.js";
import tabs from "../components/Tabs.js";
import sb from "../components/types/StringBox.js";

import iris from "./model/Iris.js";
import perfil from "./modules/perfil/perfil.js";
import rutas from "./modules/rutas/rutas.js";
import gastos from "./modules/gastos/gastos.js"; 
import resumen from "./modules/resumen.js";
import sendTab from "./modules/send.js";
import otri from "./modules/otri.js";
import listIsu from "./modules/isu/list.js";

import xeco from "../xeco/xeco.js";
import list from "../xeco/modules/list.js";

coll.ready(() => {
	// init. modules actions
	xeco.init();
	perfil.init();
	rutas.init();
	gastos.init();
	otri.init();
	resumen.init();
	sendTab.init();

	const form = xeco.getForm();
	form.set("is-resumable", iris.isResumable).set("is-urgente", iris.isUrgente);
	form.onChangeInputs(".ui-pf", (ev, el) => { el.previousElementSibling.value = ev.target.value; }); // update pf inputs 

	const fnPerfil = iris => {
		iris.codigo = iris.id ? iris.cod : null; // synonym
		const parts = sb.split(iris.cod, "/"); // ej: 2025/5697/P/PDI-FU/COM/AyL/A83
		iris.setPerfil(parts[2], parts[3], parts[4], parts[5], parts[6]); 
	}

	iris.view = data => { // Init IRSE form
		xeco.view(data.iris, data.firmas); // load view
		fnPerfil(data.iris); // load codigo
		perfil.view(data.interesado, data.organicas);
		rutas.setRutas(data.rutas || []);
		gastos.setGastos(data.gastos || []);

		otri.view(); // paso 3 = isu
		resumen.view(); // update tables for paso 6
		sendTab.view(data.cuentas);
	}

	iris.update = data => { // update IRSE form
		form.reset("input[id$='-json']"); // update fields
		xeco.update(data.iris, data.firmas, data.tab); // Update firmas blocks
		fnPerfil(data.iris); // load codigo
		perfil.update(data.interesado);
		rutas.update(data.rutas);
		gastos.update(data.gastos);
	
		//otri.update(); // paso 3 = isu
		resumen.update(); // update tables for paso 6
		sendTab.update(data.cuentas);
	}

	/*********** Extra list actions ***********/
	const fnPaso8 = data => (i18n.confirm("msgReactivarP8") && list.send(window.rcPaso8, data));
	list.getTable().set("#rcPaso8", fnPaso8); // set table action
	list.getTable().set("#rcFinalizar", data => list.send(window.rcFinalizar, data)); // html report
	tabs.setAction("finalizar", () => list.send(window.rcFinalizar)); // set tab action

	/*********** Listado ISU - Justifi OTRI ***********/
	tabs.setInitEvent("listIsu", listIsu.init);
});
