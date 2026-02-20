
import Table from "../../components/Table.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import i18n from "../../i18n/langs.js";

import Filter from "./filter.js";
import Uxxiec from "./uxxiec.js";

export default class Solicitudes extends Table {
	#solicitud; // model instance

	constructor(solicitud, opts) {
		const filter = new Filter(); // filter instance
		const url = solicitud.getUrl(); // url base path
		super(filter.getNextElement(), opts); // call super before this reference

		const tabUxxi = tabs.getTab("uxxiec"); // server info.
		this.#solicitud = solicitud.setUser(tabUxxi.dataset);

		const uxxiec = new Uxxiec(); // uxxi-ec form instance
		uxxiec.init(this); // set handlers to uxxi-ec form
		filter.init(this); // set handlers with reference to this list

		// default list handlers
		this.setMsgEmpty("No se han encontrado solicitudes para a la búsqueda seleccionada")
			.set("#emails", data => api.init().json(url + "/emails?id=" + data.id)); // admin test email
		this.setRemove(data => {
			const id = data.id || solicitud.getId(); // row selected or current data
			return api.init().json(url + "/remove?id=" + id).then(tabs.showList);  // remove = Promise
		});
		this.set("#integrar", data => { // integra la solicitud seleccionada en uxxiec
			i18n.confirm("msgIntegrar") && api.init().json(url + "/ws?id=" + data.id).then(this.setWorking);
		});
		this.set("update-estado", td => { // actualizo la celda del estado
			const dataCached = solicitud.getData(); // save data cached
			this.load(this.getCurrent()); // datos de la fila
			td.className = solicitud.getStyleByEstado() + " hide-xs table-refresh"; // set estilos
			td.innerHTML = solicitud.getDescEstado(); // set texto de estado
			solicitud.setData(dataCached); // restore data if not cached
		});
		this.view(); // initial render
		tabs.setAction("remove", this.remove);
	}

	getSolicitud = () =>  this.#solicitud; // get solicitud
	load = data => this.#solicitud.setData(data || this.getCurrent()); // update data model
	setProcesando = () => this.load().setProcesando(); // set estado procesando ...
	updateRow() { this.refreshRow(this.load()); tabs.showList(); } // refresh current row + show list tab
	setWorking = () => { this.refreshRow(this.setProcesando()); tabs.showList(); } // update current row state

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
}
