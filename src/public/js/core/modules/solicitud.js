
import FormBase from "../../components/forms/FormBase.js";
import tabs from "../components/tabs/Tabs.js";
import api from "../components/Api.js";
import i18n from "../i18n/langs.js";
import observer from "../util/Observer.js";
import Solicitud from "../model/Solicitud.js";
import tables from "../components/tables/Tables.js";

import Filter from "./FilterOld.js";
import Uxxiec from "./uxxiec.js";
import Firmas from "../../core/components/layouts/Firmas.js";

export default class SolicitudForm extends FormBase {
	#solicitudes; #solicitud;

	constructor(opts) {
		super("solicitud", opts); // build instance
		this.#solicitud = Solicitud.getInstance().setUser(this.getForm().dataset);
	}

	init() { // set default handlers
		this.#solicitudes = tables.getSolicitudes(); // tabla de solicitudes
		this.#solicitudes.set("#view", this.view).set("#firmar", this.firmar).set("#reject", this.showReject)
				.set("#report", this.report) // call report service //.set("#pdf", fnPdf); // report template service 
				.set("#reactivar", this.reactivar).set("#reset", this.reactivar); // acciones para reactivar / resetear solicitud
		return super.init();
	}

	getSolicitudes = () => this.#solicitudes; // list
	setFirmas(firmas) { Firmas.notify(firmas); return this; }
	showForm() { this.reactivate(this.#solicitudes.load()); tabs.showForm(); } // open form tab
	showReject = data => {
		const isCached = this.isCached(data.id); // check if data is cached
		const model = this.#solicitud.setData(data); // update data model
		this.setFirmas(isCached).closeAlerts().setEditable(model).refresh(model); // no cache
		tabs.show("reject"); // move to reject tab
		this.getElement("rechazo").restart(); // reload autocomplete
	}

	onView() {} // optional event on view action
	open = data => { // cargo los datos y preparo los campos del formulario en la vista
		this.setFirmas(data.firmas).load(this.#solicitud.setData(data.solicitud));
		this.onView(data); // actions after load data from server
		tabs.showForm(); // show form tab
	}
	close = data => { // refresh form if cached + current row in list
		if (this.isCached(this.#solicitudes.getId()))
			this.setFirmas(data.firmas).refresh(this.#solicitudes.load());
		this.#solicitudes.showList();
	}

	create(data) {
		this.#solicitudes.clear(); // not row selected
		this.open(data); // prepare form view
	}
	view = data => { // view action
		if (data.solicitud) // create action
			return this.create(data); // load data and show form tab
		if (this.isCached(data.id)) // view action from solicitudes list
			this.setFirmas(true).showForm(); // reload current table data
		else
			api.init().json(this.#solicitud.getUrl() + "/view?id=" + data.id).then(this.open); // get method
	}

	firmar = data => this.getElement("firmar").firmar(data); // table action link
	rechazar = () => this.getElement("rechazar").execute(); // execute reject action
	cancelar = () => this.getElement("cancelar").execute(); // execute cancel action
	reactivar = data => this.getElement("subsanar").reactivar(data); // reactivar/subsanar
	report = () => this.getElement("report").execute(); // call report service
}

customElements.define("filter-form", Filter, { extends: "form" });
customElements.define("uxxiec-form", Uxxiec, { extends: "form" });
