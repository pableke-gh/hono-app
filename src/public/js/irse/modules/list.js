
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";
import i18n from "../i18n/langs.js";

import irse from "../model/Irse.js";
import xeco from "../../xeco/xeco.js";

function List() {
	this.init = () => {
		xeco.init(); // init xeco form and list
		i18n.set("fCache", (new Date()).addDays(-1).toISOString()); // fecha de la cache

		/*********** Redefine handlers and add extra actions ***********/
		const table = xeco.getTable(); // Current table of solicitudes
		const fnIdParam = data => { loading(); return [{ name: "id", value: data.id }]; }
		table.set("#view", data => (window.isCached(data.id, irse.setData(data).getInitTab()) || window.rcView(fnIdParam(data)))); // set table action
		//table.set("#paso8", data => (i18n.confirm("msgReactivarP8") && window.rcPaso8(fnIdParam(data)))); // set table action
		table.set("#paso8", data => (i18n.confirm("msgReactivarP8") && api.init().json("/uae/iris/paso8?id=" + data.id))); // set table action
		table.set("#clone", data => (i18n.confirm("reactivar") && window.rcClone(fnIdParam(data)))); // set table action
		table.set("#rptFinalizar", data => api.init().text("/uae/iris/report/finalizar?id=" + data.id).then(api.html)); // html report
		tabs.setAction("rptFinalizar", () => table.invoke("#rptFinalizar")); // set tab action
	}

	// download iris-facturas.zip / iris-doc.zip
	tabs.setAction("zip-com", () => api.setZip().blob("/uae/iris/zip/comisionado").then(data => api.download(data, "iris-facturas.zip")));
	tabs.setAction("zip-doc", () => api.setZip().blob("/uae/iris/zip/documentacion").then(data => api.download(data, "iris-doc.zip")));
}

export default new List();
