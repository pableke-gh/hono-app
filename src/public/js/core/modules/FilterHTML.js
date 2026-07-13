
import api from "../components/Api.js";
import sb from "../../components/types/StringBox.js";
import tabs from "../components/tabs/Tabs.js";

import FormHTML from "../components/forms/Form.js";
import ListTab from "./tabs/List.js";

/**
 * Nuevo filtro de consulta para la tabla principal
 * Utilizado en las aplicaciones de pedidos, subvenciones, etc.
 */
export default class FilterForm extends FormHTML {
	getRegistros = () => this.nextElementSibling; // tabla de solicitudes / registros
	getSolicitudes = () => this.nextElementSibling; // tabla de solicitudes / pedidos

	list() {
		const url = this.getAttribute("action") + "/list"; // build url
		const fnThen = data => this.getTable().render(data); // show table data
		api.setJSON(this.getData()).json(url).then(fnThen); // request query
	}

	listAll() {
		this.reset(); // reset all values
		this.list(); // fetch list
	}

	relist() {
		this.reset(); // clear inputs
		this.elements.ej.value = sb.getYear(); // ej actual
		this.elements.firma.value = "5"; // firma en estado pendiente
		this.list(); // fetch list
	}

	aceptadas() { // solicitudes aceptadas
		if (this.elements.estado.value)
			return tabs.showList(); // preloaded
		this.reset(); // clear inputs
		this.elements.estado.value = "1";
		this.list(); // fetch list
	}

	connectedCallback() {
		super.connectedCallback(); // initialize form
		const solicitudes = this.nextElementSibling; // tabla de solicitudes
		this.setTable(solicitudes); // set table to reload

		this.addEventListener("submit", ev => {
			this.isChanged() && this.list();
			ev.preventDefault();
			this.setChanged();
		});

		this.elements.ej.setLabels(sb.getEjercicios()); // ultimos 6 ej
		this.elements.firma.value = "5"; // firma en estado pendiente
		tabs.setAction("relist", () => this.relist()); // reload list with default filter
		tabs.setAction("list-all", () => this.listAll()); // list all  solicitudes in year
		tabs.setAction("vinc", () => this.aceptadas()); // solicitudes aceptadas a vincular
	}
}

customElements.define("tab-list", ListTab, { extends: "div" });
