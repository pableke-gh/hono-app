
//import Form from "../../components/forms/Form.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";
import i18n from "../i18n/langs.js";

import irse from "../model/Irse.js";
import xeco from "../../xeco/xeco.js";

function List() {
	this.init = () => {
		xeco.init(); // init xeco form and list
		/*const formList = new Form("#xeco-filter-old"); // Current form
		window.clickVinc = () => formList.reset(".ui-filter").setval("#estado", "1").click("#filter-list");
		window.onList = () => formList.reset(".ui-filter").setval("#firma", "5").loading();
		window.clickList = () => window.onList().click("#filter-list");
		window.onListAll = () => formList.reset(".ui-filter").loading();*/
		i18n.set("fCache", (new Date()).addDays(-1).toISOString()); // fecha de la cache

		/*********** Redefine handlers and add extra actions ***********/
		const table = xeco.getTable(); // Current table of solicitudes
		const fnIdParam = data => { loading(); return [{ name: "id", value: data.id }]; }
		table.set("#view", data => (window.isCached(data.id, irse.setData(data).getInitTab()) || window.rcView(fnIdParam(data)))); // set table action
		//table.set("#paso8", data => (i18n.confirm("msgReactivarP8") && window.rcPaso8(fnIdParam(data)))); // set table action
		table.set("#paso8", data => (i18n.confirm("msgReactivarP8") && api.init().json("/uae/iris/paso8?id=" + data.id))); // set table action
		table.set("#clone", data => (i18n.confirm("reactivar") && window.rcClone(fnIdParam(data)))); // set table action
		//table.set("#firmar", data => (i18n.confirm("msgFirmar") && window.rcFirmar(fnIdParam(data)))); // set table action
		table.set("#rptFinalizar", data => api.init().text("/uae/iris/report/finalizar?id=" + data.id).then(api.html)); // html report
		tabs.setAction("rptFinalizar", () => table.invoke("#rptFinalizar")); // set tab action
	}

	// avoid JS error when PF autocall list buttons
	//window.clickVinc = window.onList = window.clickList = globalThis.void;
}

export default new List();
