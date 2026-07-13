
import sb from "../../components/types/StringBox.js";
import FormHTML from "../../components/forms/FormHTML.js";
import tabs from "../components/tabs/TabsOld.js";
import api from "../components/Api.js"

/**
 * Filtro de consulta para la tabla principal
 * Utilizado en las aplicaciones de PRESTO; IRIS y Solicitud de Facturas 
 */
export default class FilterForm extends FormHTML {
	getRegistros = () => this.nextElementSibling; // tabla de solicitudes / registros
	getSolicitudes = () => this.nextElementSibling; // tabla de solicitudes / registros

	list() {
		const url = this.getAttribute("action") + "/list";
		api.setJSON(this.getData()).json(url).then(data => {
			this.getSolicitudes().render(data);
			tabs.showList(); // force list tab
		});
	}

	listAll() {
		const ej = this.elements.ej.value; // store selected ej
		this.reset(); // reset all values
		this.elements.ej.value = ej; // preserve selected ej
		this.list(); // fetch list
	}

	relist() {
		this.reset(); // clear inputs
		this.elements.ej.value = sb.getYear(); // ej actual
		this.elements.fmask.value = "5"; // firma en estado pendiente
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
		this.addEventListener("submit", ev => {
			this.isChanged() && this.list();
			ev.preventDefault();
			this.setChanged();
		});

		window.solicitudes = this.nextElementSibling; // global access before connectedCallback
		this.elements.ej.setLabels(sb.getEjercicios()); // ultimos 6 ej
		this.elements.fmask.value = "5"; // firma en estado pendiente

		tabs.setInitEvent("list", () => { this.getSolicitudes().isEmpty() && this.list(); });
		tabs.setAction("relist", () => this.relist()); // reload list with default filter
		tabs.setAction("list-all", () => this.listAll()); // list all  solicitudes in year
		tabs.setAction("vinc", () => this.aceptadas()); // solicitudes aceptadas a vincular

		// global tabs actions
		tabs.setAction("clickNext", link => link.nextElementSibling.click()); // fire click event for next sibling element
		tabs.setAction("closeModal", link => link.closest("dialog").close()); // close modal action
	}
}
