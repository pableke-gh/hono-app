
import coll from "../../components/CollectionHTML.js";
import Form from "../../components/forms/Form.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import i18n from "../../i18n/langs.js";
import firma from "../model/Firma.js";

export default class Solicitud extends Form {
	#solicitudes; #solicitud; #valid;

	constructor(solicitudes, solicitud, opts) {
		super("#xeco-model", opts); // instance super
		this.#solicitudes = solicitudes; // solicitudes module list
		this.#solicitud = solicitud; // solicitud model instance

		// set default handlers
		solicitudes.set("#view", this.view).set("#firmar", this.firmar).set("#reject", this.reject)
			.set("#report", this.report) // call report service //.set("#pdf", fnPdf); // report template service 
			.set("#reactivar", this.reactivar).set("#reset", this.reactivar); // acciones para reactivar / resetear solicitud

		tabs.setAction("view", () => this.view(solicitudes.getCurrent()));
		tabs.setAction("reject", () => this.reject(solicitudes.getCurrent()))
			.setAction("rechazar", () => this.rechazar(solicitudes.getCurrent()))
			.setAction("cancelar", () => this.cancelar(solicitudes.getCurrent()));
		const fnReactivar = () => this.reactivar(solicitudes.getCurrent());
		tabs.setAction("reactivar", fnReactivar).setAction("reset", fnReactivar);
		tabs.setAction("report", this.report); //tabs.setAction("pdf", this.pdf);
		tabs.setAction("firmar", () => { // post method
			if (!i18n.confirm("msgFirmar")) return; // confirm
			const data = Object.assign(this.#solicitud.getData(), this.getData()); // merge data
			api.setJSON(data).json(this.#solicitud.getUrl() + "/firmar").then(this.#refreshForm); // post method
			this.#solicitudes.setProcesando(); // update current row to avoid reclicks
		});
	}

	viewInit = () => { this.resetCache(); tabs.showInit(); }
	showForm = () => this.reactivate(this.#solicitudes.load()); // open form tab
	report = () => api.init().text(this.#solicitud.getUrl() + "/report?id=" + this.#solicitudes.getId()).then(api.open); // call report service
	setValidators(valid) { this.#valid = valid; return this; } 

	#validReject = msg => (this.#valid.rechazar() && i18n.confirm(msg)); // validate form + user confirm
	#rejectParams = id => ({ id, rechazo: this.getValueByName("rechazo") }); // get url params 
	#refreshForm = data => { // refresh form if cached + current row in list
		if (this.isCached(this.#solicitudes.getId()))
			this.setFirmas(data.firmas).refresh(this.#solicitudes.load());
		this.#solicitudes.refreshRow();
	}
	firmar = data => { // get method
		if (!i18n.confirm("msgFirmar")) return; // confirm
		const url = this.#solicitudes.setProcesando().getUrl() + "/firmar?id=" + data.id;
		api.init().json(url).then(this.#refreshForm); // call service
	}
	reject = data => { // refresh and open reject tab from list
		const isCached = this.isCached(data.id); // check if data is cached
		this.set("update-firmas", el => el.setVisible(isCached)).refresh(this.#solicitudes.load());
		tabs.showTab("reject"); // show form
	}
	rechazar = data => { // accion de rechazo
		if (!this.#validReject("msgRechazar")) return; // validation error or cancel by user
		const url = this.#solicitudes.load(data).setRechazada().getUrl() + "/rechazar"; // url de rechazo => estado = 2
		api.init().json(url, this.#rejectParams(data.id)).then(this.#refreshForm);
	}
	cancelar = data => { // accion de cancelacion
		if (!this.#validReject("msgCancelar")) return; // validation error or cancel by user
		const url = this.#solicitudes.load(data).setCancelada().getUrl() + "/cancelar"; // url de cancelacion => estado = 7
		api.init().json(url, this.#rejectParams(data.id)).then(this.#refreshForm);
	}
	setFirmas(firmas) {
		if (firmas) { // compruebo si hay firmantes
			const tpl = coll.render(firmas.slice(1), firma.render);
			this.set("update-firmas", el => {
				el.children[2].innerHTML = tpl; // render block
				if (this.#solicitud.isInvalidada()) { // rechazado o cancelado
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

	onView() {} // optional event on view action
	#showForm = data => { // load data and show form tab
		const solicitud = this.#solicitud;
		if (!solicitud.isValid(data)) // no data => error
			return this.showError("No se han podido cargar los datos del servidor.");
		solicitud.setData(data.solicitud); // 1º carga los datos de la solicitud
		super.setData(data.solicitud).setCache(solicitud.getId()); // 2º update inputs values + set form cache
		const tab = this.setFirmas(data.firmas).onView(data); // 3º actualizo las firmas asociadas + specific on-view action + get tab to show
		this.setValues(solicitud.getData()).reactivate(solicitud, tab); // 4º update form state
	}
	create = this.#showForm;
	view = data => { // view action
		if (data.solicitud) // create action
			return this.#showForm(data); // load data and show form tab
		if (this.isCached(data.id)) // view action from solicitudes list
			return this.set("update-firmas", el => el.show()).showForm(); // datos pre-cargados y firmas visibles
		api.init().json(this.#solicitud.getUrl() + "/view?id=" + data.id).then(this.#showForm); // get method
	}
	reactivar = data => { // set inputs to editable and update view
		if (!i18n.confirm("msgReactivar")) return; // cancel by user
		if (this.isCached(data.id)) // solicitud pre-loaded
			return this.reactivate(this.#solicitud.setSubsanable()); // show current data
		api.init().json(this.#solicitud.getUrl() + "/reactivar?id=" + data.id).then(this.#showForm); // get method
	}

	onUpdate() {} // optional event on update action
	update = (data, tab) => {
		data.solicitud && this.#solicitudes.load(data.solicitud); // 1º carga los datos de la solicitud
		data.firmas && this.setFirmas(data.firmas); // 2º actualizo la vista de firmas asociadas
		this.onUpdate(data); // 3º specific update action
		tabs.goTab(tab); // 4º show specific form tab
	}
}
