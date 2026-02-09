
import coll from "../../components/CollectionHTML.js";
import Form from "../../components/forms/Form.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import i18n from "../../i18n/langs.js";
import valid from "../i18n/validators.js";
import firma from "../model/Firma.js";
import solicitudes from "./solicitudes.js";

class Solicitud extends Form {
	constructor(opts) { super("#xeco-model", opts); }

	getList = () => solicitudes;
	refresh() { return super.refresh(solicitudes.getSolicitud()); }
	viewInit = () => { this.resetCache(); tabs.showInit(); }
	showForm = () => { this.closeAlerts().refresh(); tabs.showForm(); } // open form tab
	report = data => api.init().text(solicitudes.getSolicitud().getUrl() + "/report?id=" + data.id).then(api.open); // call report service

	#validReject = msg => (valid.firma() && i18n.confirm(msg)); // validate form + user confirm
	#rejectParams = () => ({ id: solicitudes.getId(), rechazo: this.getValueByName("rechazo") }); // get url params 
	#refreshForm = data => { // refresh form if cached + current row in list
		if (solicitudes.isCached())
			this.setFirmas(data.firmas).refresh();
		solicitudes.refreshRow();
	}
	firmar = data => { // get method
		const dataCached = solicitudes.getSolicitud().getData(); // save data cached
		const fnSend = () => (solicitudes.load(data).setProcesando().getUrl() + "/firmar?id=" + data.id);
		i18n.confirm("msgFirmar") && api.init().json(fnSend()).then(this.#refreshForm);
		solicitudes.load(dataCached); // restore data if not cached
	}
	reject = data => { // refresh and open reject tab from list
		const isCached = this.isCached(data.id); // check if data is cached
		const dataCached = solicitudes.getSolicitud().getData(); // save data cached
		this.set("update-firmas", el => el.setVisible(isCached)).refresh(solicitudes.load(data));
		solicitudes.load(dataCached); // restore data if not cached
		tabs.showTab("reject"); // show form
	}
	rechazar = data => { // accion de rechazo
		const dataCached = solicitudes.getSolicitud().getData(); // save data cached
		const fnSend = () => (solicitudes.load(data).setRechazada().getUrl() + "/rechazar"); // url de rechazo => estado = 2
		this.#validReject("msgRechazar") && api.init().json(fnSend(), this.#rejectParams()).then(this.#refreshForm);
		solicitudes.load(dataCached); // restore data if not cached
	}
	cancelar = data => { // accion de cancelacion
		const dataCached = solicitudes.getSolicitud().getData(); // save data cached
		const fnSend = () => (solicitudes.load(data).setCancelada().getUrl() + "/cancelar"); // url de cancelacion => estado = 7
		this.#validReject("msgCancelar") && api.init().json(fnSend(), this.#rejectParams()).then(this.#refreshForm);
		solicitudes.load(dataCached); // restore data if not cached
	}
	setFirmas(firmas) {
		if (firmas) { // compruebo si hay firmantes
			const tpl = coll.render(firmas.slice(1), firma.render);
			this.set("update-firmas", el => {
				el.children[2].innerHTML = tpl; // render block
				if (solicitudes.getSolicitud().isInvalidada()) { // rechazado o cancelado
					const rechazo = firmas.find(firma.isRechazada);
					if (!rechazo) return; // clausula de guarda
					rechazo.rejectedBy = firma.getNombre(rechazo);
					el.children[3].render(rechazo);
				}
				else
					el.children[3].hide();
				el.show();
			});
			super.reset("#rechazo");
		}
		else
			this.set("update-firmas", null);
		return this;
	}

	#showView = data => { // load data and show form tab
		const solicitud = solicitudes.getSolicitud();
		if (!solicitud.isValid(data)) // no data => error
			return this.showError("No se han podido cargar los datos del servidor.");
		solicitud.setData(data.solicitud); // 1º carga los datos de la solicitud
		super.setData(data.solicitud).setCache(solicitud.getId()); // 2º update inputs values
		this.setFirmas(data.firmas); // 3º actualizo la vista de firmas asociadas
		const tab = solicitud.onView(data); // 4º specific on-view action + get tab to show
		this.setValues(solicitud.getData()).reactivate(solicitud, tab); // 5º update form state
	}
	view = data => {
		if (data.solicitud) // create action
			return this.#showView(data); // load data and show form tab
		if (this.isCached(data.id)) // view action from solicitudes list
			return this.set("update-firmas", el => el.show()).showForm(); // datos pre-cargados y firmas visibles
		api.init().json(solicitudes.getSolicitud().getUrl() + "/view?id=" + data.id) // get method
					.then(this.#showView).then(solicitudes.replaceData);
	}
	reactivar = data => { // set inputs to editable and update view
		if (!i18n.confirm("msgReactivar")) return; // cancel by user
		const solicitud = solicitudes.getSolicitud(); // current solicitud
		if (this.isCached(data.id)) // solicitud pre-loaded
			return this.reactivate(solicitud.setSubsanable()); // show current data
		api.init().json(solicitud.getUrl() + "/reactivar?id=" + data.id) // get method
					.then(this.#showView).then(solicitudes.replaceData);
	}

	update = (data, tab) => {
		data.solicitud && solicitudes.load(data.solicitud); // 1º carga los datos de la solicitud
		data.firmas && this.setFirmas(data.firmas); // 2º actualizo la vista de firmas asociadas
		solicitudes.getSolicitud().onUpdate(data); // 3º specific update action
		tabs.goTab(tab); // 4º show specific form tab
	}

	setEvents() { // set default handlers
		const solicitud = solicitudes.getSolicitud();
		tabs.setAction("firmar", () => { // post method
			if (!i18n.confirm("msgFirmar")) return; // confirm
			const data = Object.assign(solicitud.getData(), this.getData()); // merge data
			api.setJSON(data).json(solicitud.getUrl() + "/firmar").then(this.#refreshForm); // send action
			solicitud.setProcesando(); // update current row to avoid reclicks
		});
	}
}

export default new Solicitud();
