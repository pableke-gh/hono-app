
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
import SolicitudesList from "../xeco/modules/SolicitudesList.js";

coll.ready(() => { // init. iris modules actions
	const list = new SolicitudesList(iris);
	const form = list.init().getForm();
	perfil.init(); rutas.init(); gastos.init();
	otri.init(); resumen.init(); sendTab.init();

	form.set("is-editable-p8", () => (iris.isEditable() && iris.isPaso8()));
	iris.onView = data => { // Init IRSE form
		perfil.view(data.interesado, data.organicas, data.firmas);
		rutas.setRutas(data.rutas || []);
		gastos.setGastos(data.gastos || []);

		otri.view(); // paso 3 = isu
		resumen.view(); // update tables for paso 6
		sendTab.view(data.cuentas); // paso 9
		return iris.getInitTab(); // go form tab
	}

	iris.onUpdate = data => { // update IRSE form
		data.interesado && iris.setInteresado(data.interesado);
		rutas.update(data.rutas);
		gastos.update(data.gastos);
		form.setChanged().refresh(iris);
	}

	/*********** Extra list actions ***********/
	const table = list.getTable(); // Current table of solicitudes
	table.set("#paso8", data => (i18n.confirm("msgReactivarP8") && api.init().json("/uae/iris/paso8?id=" + data.id))); // set table action
	table.set("#rptFinalizar", data => api.init().text("/uae/iris/report/finalizar?id=" + data.id).then(api.html)); // html report
	tabs.setAction("rptFinalizar", () => table.invoke("#rptFinalizar")); // set tab action

	/*********** Listado ISU - Justifi OTRI ***********/
	tabs.setInitEvent("listIsu", listIsu.init);
});
