
import coll from "../../components/CollectionHTML.js";
import Form from "../../components/forms/Form.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import i18n from "../../i18n/langs.js";

//import Solicitud from "../model/Solicitud.js";
import firma from "../model/Firma.js";

class SolicitudForm extends Form {
	#solicitud;// = new Solicitud(); // create instance
	constructor(opts) { super("#xeco-model", opts); }

	getSolicitud = () => this.#solicitud; // get solicitud
	setSolicitud = model => { this.#solicitud = model; return this; } // set model solicitud
	isCached = id => this.#solicitud.eq(id); // is solicitud loaded
	refresh = () => Form.prototype.refresh.call(this, this.#solicitud); // simulate super keyword from arrow function
	reset = () => { this.#solicitud.reset(); tabs.showInit(); }
	report = data => api.init().text(this.#solicitud.getUrl() + "/report?id=" + data.id).then(api.open); // call report service
	showForm = () => { this.refresh(); tabs.showForm(); }

	#validConfirm = msg => this.validate(firma.validate) && i18n.confirm(msg); // validate form + user confirm
	#rejectParams = () => ({ id: this.#solicitud.getId(), rechazo: this.getValueByName("rechazo") }); // get url params 
	#refreshForm = data => { // refresh form if cached + current row in list
		if (this.isCached(this.#solicitud.getId()))
			this.setFirmas(data.firmas).refresh();
		this.list.refreshRow(this.#solicitud);
	}
	firmar = data => { // get method
		const dataCached = this.#solicitud.getData(); // save data cached
		const url = this.#solicitud.setData(data).setProcesando().getUrl() + "/firmar?id=" + data.id;
		i18n.confirm("msgFirmar") && api.init().json(url).then(this.#refreshForm);
		this.#solicitud.setData(dataCached); // restore data if not cached
	}
	reject = data => { // refresh and open reject tab from list
		const isCached = this.isCached(data.id); // check if cached
		const dataCached = this.#solicitud.getData(); // save data cached
		this.set("update-firmas", el => el.setVisible(isCached)).refresh(this.#solicitud.setData(data));
		this.#solicitud.setData(dataCached); // restore data if not cached
		tabs.showTab("reject"); // show form
	}
	rechazar = data => { // accion de rechazo
		const dataCached = this.#solicitud.getData(); // save data cached
		const url = this.#solicitud.setData(data).setRechazada().getUrl() + "/rechazar"; // url de rechazo => estado = 2
		this.#validConfirm("msgRechazar") && api.init().json(url, this.#rejectParams()).then(this.#refreshForm);
		this.#solicitud.setData(dataCached); // restore data if not cached
	}
	cancelar = data => { // accion de cancelacion
		const dataCached = this.#solicitud.getData(); // save data cached
		const url = this.#solicitud.setData(data).setCancelada().getUrl() + "/cancelar"; // url de cancelacion => estado = 7
		this.#validConfirm("msgCancelar") && api.init().json(url, this.#rejectParams()).then(this.#refreshForm);
		this.#solicitud.setData(dataCached); // restore data if not cached
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

	#showView = data => { // load data and show form tab
		this.#solicitud.setData(data.solicitud); // 1º carga los datos de la solicitud
		super.setData(data.solicitud); // 2º update inputs values
		this.setFirmas(data.firmas); // 3º actualizo la vista de firmas asociadas
		const tab = this.#solicitud.onView(data); // 4º specific on-view action + get tab to show
		this.setValues(this.#solicitud.getData()).reactivate(this.#solicitud, tab); // 5º update form state
	}
	view = data => {
		if (data.solicitud) // create action
			return this.#showView(data); // load data and show form tab
		if (this.isCached(data.id)) { // view action from solicitudes list
			this.closeAlerts().set("update-firmas", el => el.show()); // firmas block visible
			return this.showForm(); // data pre-loaded
		}
		const url = this.#solicitud.getUrl() + "/view?id=" + data.id; // url
		api.init().json(url).then(this.#showView).then(this.list.replace); // get method
	}
	reactivar = data => { // set inputs to editable and update view
		if (!i18n.confirm("msgReactivar"))
			return; // cancel by user
		if (this.isCached(data.id) && this.#solicitud.isModificable()) // solicitud pre-loaded
			return this.reactivate(this.#solicitud); // show current data
		const url = this.#solicitud.getUrl() + "/reactivar?id=" + data.id; // url
		api.init().json(url).then(this.#showView).then(this.list.replace); // get method
	}

	update = (data, tab) => {
		data.solicitud && this.#solicitud.setData(data.solicitud); // 1º carga los datos de la solicitud
		data.firmas && this.setFirmas(data.firmas); // 2º actualizo la vista de firmas asociadas
		this.#solicitud.onUpdate(data); // 3º specific update action
		tabs.goTab(tab); // 4º show specific form tab
	}

	setEvents() { // set default handlers
		tabs.setAction("firmar", () => { // post method
			if (!i18n.confirm("msgFirmar")) return; // confirm
			const data = Object.assign(this.#solicitud.getData(), this.getData()); // merge data
			api.setJSON(data).json(this.#solicitud.getUrl() + "/firmar").then(this.#refreshForm); // send action
			this.#solicitud.setProcesando(); // update current row to avoid reclicks
		});
	}
}

export default new SolicitudForm();
