
import TableHTML from "../../components/TableHTML.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import i18n from "../../i18n/langs.js";

import Filter from "./filter.js";
import Uxxiec from "./uxxiec.js";

export default class Solicitudes extends TableHTML {
	#solicitud; // model instance

	constructor(solicitud) {
		super(); // Must call super before 'this'
		window.solicitudes = this; // global access before connectedCallback
		this.#solicitud = solicitud; // set current instance
		customElements.define("filter-form", Filter, { extends: "form" });
		customElements.define("uxxiec-form", Uxxiec, { extends: "form" });
	}

	connectedCallback() { // default list handlers
		const solicitud = this.#solicitud; // current instance
		const url = solicitud.getUrl(); // url base path
		const tabUxxi = tabs.getTab("uxxiec"); // server info.
		this.#solicitud = solicitud.setUser(tabUxxi.dataset);

		this.setMsgEmpty("No se han encontrado solicitudes para a la búsqueda seleccionada")
			.set("#emails", data => api.init().json(url + "/emails?id=" + data.id)); // admin test email
		this.set("#integrar", data => { // integra la solicitud seleccionada en uxxiec
			i18n.confirm("msgIntegrar") && api.init().json(url + "/ws?id=" + data.id).then(this.setWorking);
		});
		this.set("isFirmable", (link, data) => solicitud.setData(data).isFirmable())
		this.set("isIntegrable", (link, data) => solicitud.setData(data).isIntegrable())
		this.set("update-estado", (td, data) => { // actualizo la celda del estado
			td.innerHTML = solicitud.setData(data).getDescEstado(); // set texto de estado
			td.className = solicitud.getStyleByEstado() + " hide-xs table-refresh"; // set estilos
		});
		this.view(); // initial render
		tabs.setAction("remove", this.remove); // default remove
		return this;
	}

	getSolicitud = () => this.#solicitud; // get solicitud
	showList() { this.refreshRow(); tabs.showList(); } // refresh current row + show list tab
	load = data => this.#solicitud.setData(data || this.getCurrent()); // update data model
	setProcesando = () => this.load().setProcesando(); // set estado procesando ...
	setWorking = () => { this.setProcesando(); this.showList(); } // update current row state

	row(data) { // to simulate super keyword from arrow function, 'row' must be defined as a function
		let acciones = '<a href="#view"><i class="fas fa-search action resize text-blue"></i></a>';
		if (this.load(data).isFirmable()) { // initialize and verify state
			acciones += '<a href="#firmar" class="resize table-refresh" data-refresh="isFirmable"><i class="fas fa-check action resize text-green"></i></a>';
			acciones += '<a href="#reject" class="resize table-refresh" data-refresh="isFirmable"><i class="fas fa-times action resize text-red"></i></a>';
		}
		if (this.#solicitud.isEjecutable())
			acciones += '<a href="#uxxiec"><i class="fal fa-cog action resize text-green"></i></a>';
		if (this.#solicitud.isIntegrable())
			acciones += '<a href="#integrar" class="table-refresh" data-refresh="isIntegrable"><i class="far fa-save action resize text-blue"></i></a>';
		if (this.#solicitud.isAdmin())
			acciones += '<a href="#emails"><i class="fal fa-mail-bulk action resize text-blue"></i></a><a href="#remove"><i class="fal fa-trash-alt action resize text-red"></i></a>';
		return acciones;
	}

	flush() { // override super class
		const data = this.getCurrent(); // current data row
		const id = data?.id || this.#solicitud.getId(); // row selected or current data if remove when creating
		const fnThen = () => { super.flush(); tabs.showList(); } // fire after success remove
		api.init().json(this.#solicitud.getUrl() + "/remove?id=" + id).then(fnThen);
	}
}
