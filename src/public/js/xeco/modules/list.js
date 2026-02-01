
import Table from "../../components/Table.js";
import tabs from "../../components/Tabs.js";
import Solicitud from "../model/Solicitud.js";

class Solicitudes extends Table {
	#solicitud; // create instance

	constructor() {
		super(tabs.getTab("list").querySelector("table"));
	}

	getSolicitud = () => this.#solicitud; // get solicitud
	setSolicitud = model => { this.#solicitud = model; return this; } // set model solicitud
	setData = data => { this.#solicitud.setData(data); return this; } // set data model
	isCached = id => this.#solicitud.eq(id); // is solicitud loaded

	replace() { return super.replace(this.#solicitud.getData()); } // simulate super keyword from arrow function
	refreshRow() { super.refreshRow(this.#solicitud); tabs.showList(); } // refresh current row + show list tab
}

export default new Solicitudes();
