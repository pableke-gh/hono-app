
import Form from "../../components/forms/Form.js";
import Table from "../../components/Table.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import i18n from "../../i18n/langs.js";

import form from "./SolicitudForm.js";
import uxxiec from "./SolicitudExpediente.js";

class SolicitudesList extends Table {
	#filter = new Form("#xeco-filter"); // filter form

	getForm = () => form;
	isCached = form.isCached;
	reset = () => { this.clear(); form.reset(); }
	create = form.view; // prepare a new solicitud
	viewForm = () => form.view(this.getCurrentItem());
	firmar = () => form.firmar(this.getCurrentItem());
	reject = () => form.reject(this.getCurrentItem());
	rechazar = () => form.rechazar(this.getCurrentItem());
	reactivar = () => form.reactivar(this.getCurrentItem());
	cancelar = () => form.cancelar(this.getCurrentItem());
	report = () => form.report(this.getCurrentItem());
	replace = () => Table.prototype.replace.call(this, form.getSolicitud().getData()); // simulate super keyword from arrow function
	refreshRow(data) { super.refreshRow(data); tabs.showList(); } // refresh current row + show list tab

	init = solicitud => { // set default handlers
		form.setSolicitud(solicitud).setEvents(); // specific type of solicitud
		uxxiec.setSolicitud(solicitud).setEvents(); // specific type of solicitud
		form.list = uxxiec.list = this.setTable(this.#filter.getNext("table")); // set list reference

		const url = solicitud.getUrl(); // url base path
		const fnLoadList = data => { this.render(data); solicitud.reset(); tabs.showList(); } // render table + flush cache
		const fnCallList = () => { api.setJSON(this.#filter.getData()).json(url + "/list").then(fnLoadList); } // fetch list action
		const fnList = (estado, fmask) => { this.#filter.setData({ estado, fmask }, ".ui-filter"); fnCallList(); } // prepare filter and fetch
		//const fnPdf = data => api.init().blob(url + "/pdf?id=" + data.id).then(api.open); // report template service
		window.closeForm = (xhr, status, args) => (window.showAlerts(xhr, status, args) && this.reset()); // PF hack for old version compatibility => remove

		// list handlers
		this.setRender(solicitud.row).set("#view", form.view)
		.set("#firmar", form.firmar).set("#reject", form.reject).set("#uxxiec", uxxiec.view)
		.set("#report", form.report) // call report service //.set("#pdf", fnPdf); // report template service 
		.setMsgEmpty("No se han encontrado solicitudes para a la búsqueda seleccionada")
		.set("update-estado", td => { // actualizo la celda del estado
			const dataCached = solicitud.getData(); // save data cached
			solicitud.setData(this.getCurrentItem()); // datos de la fila
			td.className = solicitud.getStyleByEstado() + " hide-xs table-refresh"; // set estilos
			td.innerHTML = solicitud.getDescEstado(); // set texto de estado
			solicitud.setData(dataCached); // restore data if not cached
		})
		.set("#reactivar", form.reactivar).set("#reset", form.reactivar) // acciones para reactivar / resetear solicitud
		.set("#emails", data => api.init().json(url + "/emails?id=" + data.id)) // admin test email
		.setRemove(data => api.init().json(url + "/remove?id=" + data.id).then(tabs.showList)) // remove true = confirm
		.set("#integrar", data => { // integra la solicitud seleccionada en uxxiec
			const fnIntegrar = () => { solicitud.setData(data).setProcesando(); this.refreshRow(solicitud); }
			i18n.confirm("msgIntegrar") && api.init().json(url + "/ws?id=" + data.id).then(fnIntegrar);
		})
		.view(); // initial render

		// form filter handlers
		this.#filter.onKeydown(ev => ((ev.key == "Enter") && fnCallList()));
		tabs.setInitEvent("list", () => { this.isEmpty() && fnList("", "5"); });
		tabs.setAction("list", () => { this.#filter.isChanged() && fnCallList(); this.#filter.setChanged(); });
		tabs.setAction("list-all", () => { this.#filter.reset(".ui-filter"); fnCallList(); });
		tabs.setAction("relist", () => fnList("", "5"));
		tabs.setAction("vinc", () => { ("1" == this.#filter.getValueByName("estado")) ? tabs.showList() : fnList("1"); });

		tabs.setAction("view", this.viewForm);
		tabs.setAction("reject", this.reject).setAction("rechazar", this.rechazar).setAction("cancelar", this.cancelar);
		tabs.setAction("reactivar", this.reactivar).setAction("reset", this.reactivar);
		tabs.setAction("report", this.report); //tabs.setAction("pdf", this.pdf);
		tabs.setAction("remove", this.remove);

		tabs.setAction("clickNext", link => { link.nextElementSibling.click(); }); // fire click event for next sibling element
		tabs.setAction("closeModal", link => link.closest("dialog").close()); // close modal action
		return this;
	}
}

export default new SolicitudesList();
