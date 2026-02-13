
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";
import i18n from "../i18n/langs.js";

import irse from "../model/Irse.js";
import solicitudes from "./solicitudes.js";
import Solicitud from "../../core/modules/solicitud.js";

class IrseSolicitud extends Solicitud {
	constructor() {
		super(solicitudes, solicitudes.getSolicitud());

		//const fnCached = id => ((window.IRSE.id == id) && !perfil.isEmpty()); // check if data is cached
		const fnIdParam = data => { loading(); return [{ name: "id", value: data.id }]; } // set param structure
		solicitudes.set("#view", data => (this.isCached(data.id) ? tabs.showTab(irse.setData(data).getInitTab()) : window.rcView(fnIdParam(data))));
		solicitudes.set("#paso8", data => (i18n.confirm("msgReactivarP8") && api.init().json("/uae/iris/paso8?id=" + data.id))); // set table action
		solicitudes.set("#clone", data => (i18n.confirm("msgReactivar") && window.rcClone(fnIdParam(data)))); // set table action
		solicitudes.set("#rptFinalizar", data => api.init().text("/uae/iris/report/finalizar?id=" + data.id).then(api.html)); // table action
		//tabs.setAction("rptFinalizar", () => this.invoke("#rptFinalizar")); // set tab action

		// PF hack for old version compatibility => remove when possible
		window.closeForm = (xhr, status, args) => {
			if (window.showAlerts(xhr, status, args)) {
				solicitudes.setWorking(); // update state
				this.viewInit(); // go init
			}
		}
	}
}

export default new IrseSolicitud();
