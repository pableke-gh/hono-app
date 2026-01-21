
import coll from "../../components/CollectionHTML.js";
import Form from "../../components/forms/Form.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import i18n from "../../i18n/langs.js";

//import Solicitud from "../model/Solicitud.js";
import firma from "../model/Firma.js";

class SolicitudForm {
	#solicitud;// = new Solicitud(); // create instance
	#form = new Form("#xeco-model"); // form module

	getForm = () => this.#form; // get form
	getSolicitud = () => this.#solicitud; // get solicitud
	setSolicitud = model => { this.#solicitud = model; return this; } // set model solicitud
	setData = data => { this.#solicitud.setData(data); return this; } // solicitud data
	isCached = id => this.#solicitud.eq(id); // is solicitud loaded
	refresh = () => { this.#form.refresh(this.#solicitud); }
	reset = () => { this.#solicitud.reset(); tabs.showInit(); }
	report = data => api.init().text(this.#solicitud.getUrl() + "/report?id=" + data.id).then(api.open); // call report service
	showForm = () => { this.refresh(); tabs.showForm(); }

	#validConfirm = msg => this.#form.validate(firma.validate) && i18n.confirm(msg); // validate form + user confirm
	#rejectParams = () => ({ id: this.#solicitud.getId(), rechazo: this.#form.getValueByName("rechazo") }); // get url params 
	firmar = data => { // get method
		const dataCached = this.#solicitud.getData(); // save data cached
		const url = this.#solicitud.setData(data).setProcesando().getUrl() + "/firmar?id=" + data.id;
		i18n.confirm("msgFirmar") && api.init().json(url).then(this.list.refreshRow);
		this.#solicitud.setData(dataCached); // restore data if not cached
	}
	reject = data => { // refresh and open reject tab from list
		const isCached = this.isCached(data.id); // check if cached
		const dataCached = this.#solicitud.getData(); // save data cached
		this.#form.set("update-firmas", el => el.setVisible(isCached)).refresh(this.#solicitud.setData(data));
		this.#solicitud.setData(dataCached); // restore data if not cached
		tabs.showTab("reject"); // show form
	}
	rechazar = data => { // accion de rechazo
		const dataCached = this.#solicitud.getData(); // save data cached
		const url = this.#solicitud.setData(data).setRechazada().getUrl() + "/rechazar"; // url de rechazo => estado = 2
		this.#validConfirm("msgRechazar") && api.init().json(url, this.#rejectParams()).then(this.list.refreshRow);
		this.#solicitud.setData(dataCached); // restore data if not cached
	}
	cancelar = data => { // accion de cancelacion
		const dataCached = this.#solicitud.getData(); // save data cached
		const url = this.#solicitud.setData(data).setCancelada().getUrl() + "/cancelar"; // url de cancelacion => estado = 7
		this.#validConfirm("msgCancelar") && api.init().json(url, this.#rejectParams()).then(this.list.refreshRow);
		this.#solicitud.setData(dataCached); // restore data if not cached
	}
	setFirmas = firmas => {
		if (firmas) { // compruebo si hay firmantes
			const tpl = coll.render(firmas.slice(1), firma.render);
			this.#form.set("update-firmas", el => {
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
			this.#form.reset("#rechazo");
		}
		else
			this.#form.set("update-firmas", null);
		return this;
	}

	#showView = data => { // load data and show form tab
		this.#solicitud.beforeView(data); // 1º specific pre-view action
		this.setData(data.solicitud); // 2º carga los datos de la solicitud
		this.#form.setData(data.solicitud); // 3º update inputs values
		this.setFirmas(data.firmas); // 4º cargo las firmas asociadas a la solicitud
		const tab = this.#solicitud.onView(data); // 5º specific on-view action + get tab to show
		this.#form.setValues(this.#solicitud.getData()).view(this.#solicitud, tab); // 6º update form state
	}
	view = data => {
		if (data.solicitud) // create action
			return this.#showView(data); // load data and show form tab
		if (this.isCached(data.id)) { // view action from solicitudes list
			this.#form.closeAlerts().set("update-firmas", el => el.show()); // firmas block visible
			return this.showForm(); // data pre-loaded
		}
		const url = this.#solicitud.getUrl() + "/view?id=" + data.id;
		api.init().json(url).then(this.#showView).then(this.list.replace); // get method
	}
	reactivar = data => { // set inputs to editable and update view
		if (!i18n.confirm("msgReactivar"))
			return; // cancel by user
		if (this.isCached(data.id) && this.#solicitud.isModificable()) // solicitud pre-loaded
			return this.#form.view(this.#solicitud); // show current data
		const url = this.#solicitud.getUrl() + "/reactivar?id=" + data.id; // url
		api.init().json(url).then(this.#showView).then(this.list.replace); // get method
	}

	update = (data, tab) => {
		data.solicitud && this.setData(data.solicitud); // 1º carga los datos de la solicitud
		data.firmas && this.setFirmas(data.firmas); // 2º actualizo la vista de firmas asociadas
		this.#solicitud.onUpdate(data); // 3º specific update action
		tabs.goTab(tab); // 4º show specific form tab
	}

	init = () => { // set default handlers
		tabs.setAction("firmar", () => { // post method
			if (!i18n.confirm("msgFirmar")) return; // confirm
			const data = Object.assign(this.#solicitud.getData(), this.#form.getData()); // merge data
			api.setJSON(data).json(this.#solicitud.getUrl() + "/firmar").then(this.list.refreshRow); // send action
			this.#solicitud.setProcesando(); // update current row to avoid reclicks
		});
	}
}

export default new SolicitudForm();
