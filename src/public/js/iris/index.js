
import coll from "../components/CollectionHTML.js";
import tabs from "../components/Tabs.js";
import api from "../components/Api.js";

import iris from "./model/Iris.js";
import perfil from "./modules/perfil/perfil.js";
import rutas from "./modules/rutas/rutasMaps.js";
import gastos from "./modules/gastos/gastos.js"; 
import resumen from "./modules/resumen.js";
import sendTab from "./modules/send.js";
import otri from "./modules/otri.js";
import listIsu from "./modules/isu/list.js";
import xeco from "../xeco/xeco.js";

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
	form.set("is-resumable", iris.isResumable).set("is-urgente", iris.isUrgente).set("is-equipo-gobierno", iris.isEquipoGob)
		.set("is-paso8", iris.isPaso8).set("is-editable-paso8", () => (iris.isEditable() && iris.isPaso8()));

	iris.view = data => { // Init IRSE form
		if (!tabs.showAlerts(data.msgs)) // show messages
			return false; // error al actualizar la solicitud

		iris.init(data.iris); // init perfil
		xeco.view(data.iris, data.firmas); // load view
		perfil.view(data.interesado, data.organicas);
		rutas.setRutas(data.rutas || []);
		gastos.setGastos(data.gastos || []);

		otri.view(); // paso 3 = isu
		resumen.view(); // update tables for paso 6
		sendTab.view(data.cuentas);
	}

	iris.update = (data, tab) => { // update IRSE form
		if (!tabs.showAlerts(data.msgs)) // show messages
			return false; // error al actualizar la solicitud
		xeco.update(data.iris, data.firmas, tab); // Update firmas blocks
		data.interesado && iris.setInteresado(data.interesado);
		rutas.update(data.rutas);
		gastos.update(data.gastos);
	}

	/*********** Extra list actions ***********/
	const table = xeco.getTable(); // Current table of solicitudes
	table.set("#paso8", data => (i18n.confirm("msgReactivarP8") && api.init().json("/uae/iris/paso8?id=" + data.id).then(iris.view))); // set table action
	table.set("#rptFinalizar", data => api.init().text("/uae/iris/report/finalizar?id=" + data.id).then(api.html)); // html report
	tabs.setAction("rptFinalizar", () => table.invoke("#rptFinalizar")); // set tab action

	/*********** Listado ISU - Justifi OTRI ***********/
	tabs.setInitEvent("listIsu", listIsu.init);
});
