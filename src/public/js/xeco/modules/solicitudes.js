
import Table from "../../components/Table.js";
import tabs from "../../components/Tabs.js";
//import Solicitud from "../model/Solicitud.js";

class Solicitudes extends Table {
	#solicitud;// = new Solicitud(); // create instance

	constructor() {
		super("table#solicitudes");
	}

	getSolicitud = () => this.#solicitud; // get solicitud
	setSolicitud = model => { this.#solicitud = model; return this; } // set model solicitud
	isCached = () => this.#solicitud.eq(this.getId()); // is solicitud loaded
	load = data => this.#solicitud.setData(data); // update data model

	replaceData = () => this.replace(this.#solicitud.getData()); // simulate super keyword from arrow function
	refreshRow() { super.refreshRow(this.#solicitud); tabs.showList(); } // refresh current row + show list tab

	init(solicitud) {
		const tabUxxi = tabs.getTab("uxxiec"); // server info.
		this.#solicitud = solicitud.setUser(tabUxxi.dataset);

		// default list handlers
		this.setRender(solicitud.row)
			.setMsgEmpty("No se han encontrado solicitudes para a la búsqueda seleccionada")
			.set("update-estado", td => { // actualizo la celda del estado
				const dataCached = solicitud.getData(); // save data cached
				solicitud.setData(solicitudes.getCurrentItem()); // datos de la fila
				td.className = solicitud.getStyleByEstado() + " hide-xs table-refresh"; // set estilos
				td.innerHTML = solicitud.getDescEstado(); // set texto de estado
				solicitud.setData(dataCached); // restore data if not cached
			});

		// global tabs actions
		tabs.setAction("clickNext", link => link.nextElementSibling.click()); // fire click event for next sibling element
		tabs.setAction("closeModal", link => link.closest("dialog").close()); // close modal action
		return this;
	}
}

export default new Solicitudes();
