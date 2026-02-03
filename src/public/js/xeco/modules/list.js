
import Form from "../../components/forms/Form.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import i18n from "../../i18n/langs.js";

import form from "./solicitud.js";
import uxxiec from "./uxxiec.js";
import solicitudes from "./solicitudes.js";

class List extends Form {
	constructor(opts) { super("#xeco-filter", opts); }

	getForm = () => form;
	getList = () => solicitudes;
	create = form.view; // prepare a new solicitud
	viewForm = () => form.view(solicitudes.getCurrentItem());
	firmar = () => form.firmar(solicitudes.getCurrentItem());
	reject = () => form.reject(solicitudes.getCurrentItem());
	rechazar = () => form.rechazar(solicitudes.getCurrentItem());
	reactivar = () => form.reactivar(solicitudes.getCurrentItem());
	cancelar = () => form.cancelar(solicitudes.getCurrentItem());
	report = () => form.report(solicitudes.getCurrentItem());

	init = solicitud => { // set default handlers
		solicitudes.init(solicitud); // init. table instance
		uxxiec.setEvents(); // specific type of solicitud
		form.setEvents(); // specific type of solicitud

		const url = solicitud.getUrl(); // url base path
		const fnLoadList = data => { solicitudes.render(data); tabs.showList(); } // render table + flush cache
		const fnCallList = () => { api.setJSON(this.getData()).json(url + "/list").then(fnLoadList); } // fetch list action
		const fnList = (estado, fmask) => { this.setData({ estado, fmask }, ".ui-filter"); fnCallList(); } // prepare filter and fetch
		//const fnPdf = data => api.init().blob(url + "/pdf?id=" + data.id).then(api.open); // report template service
		window.closeForm = (xhr, status, args) => (window.showAlerts(xhr, status, args) && solicitudes.reset()); // PF hack for old version compatibility => remove

		// list handlers
		solicitudes.set("#view", form.view)
			.set("#firmar", form.firmar).set("#reject", form.reject).set("#uxxiec", uxxiec.view)
			.set("#report", form.report) // call report service //.set("#pdf", fnPdf); // report template service 
			.set("#reactivar", form.reactivar).set("#reset", form.reactivar) // acciones para reactivar / resetear solicitud
			.set("#emails", data => api.init().json(url + "/emails?id=" + data.id)) // admin test email
			.setRemove(data => api.init().json(url + "/remove?id=" + data.id).then(tabs.showList)) // remove true = confirm
			.set("#integrar", data => { // integra la solicitud seleccionada en uxxiec
				const fnIntegrar = () => { solicitudes.load(data).setProcesando(); solicitudes.refreshRow(); }
				i18n.confirm("msgIntegrar") && api.init().json(url + "/ws?id=" + data.id).then(fnIntegrar);
			})
			.view(); // initial render

		// form filter handlers
		this.onKeydown(ev => ((ev.key == "Enter") && fnCallList()));
		tabs.setInitEvent("list", () => { solicitudes.isEmpty() && fnList("", "5"); });
		tabs.setAction("list", () => { this.isChanged() && fnCallList(); this.setChanged(); });
		tabs.setAction("list-all", () => { this.reset(".ui-filter"); fnCallList(); });
		tabs.setAction("relist", () => fnList("", "5"));
		tabs.setAction("vinc", () => { ("1" == this.getValueByName("estado")) ? tabs.showList() : fnList("1"); });

		tabs.setAction("view", this.viewForm);
		tabs.setAction("reject", this.reject).setAction("rechazar", this.rechazar).setAction("cancelar", this.cancelar);
		tabs.setAction("reactivar", this.reactivar).setAction("reset", this.reactivar);
		tabs.setAction("report", this.report); //tabs.setAction("pdf", this.pdf);
		tabs.setAction("remove", solicitudes.remove);
		return this;
	}
}

export default new List();
