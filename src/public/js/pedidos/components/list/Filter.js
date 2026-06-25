
import api from "../../../core/components/Api.js";
import sb from "../../../components/types/StringBox.js";
import tabs from "../../../core/components/helpers/Tabs.js";
import FormHTML from "../../../core/components/forms/Form.js";

export default class PedidoFilterForm extends FormHTML {
	list() {
		const fnThen = data => this.getTable().render(data); // show data
		api.setJSON(this.getData()).json("/uae/pedidos/list").then(fnThen);
	}

	relist = () => {
		this.elements.ej.value = sb.getYear(); // ej actual
		this.elements.firma.value = "5"; // firma en estado pendiente
		this.list(); // fetch list
	}

	connectedCallback() {
		super.connectedCallback(); // initialize form
		const pedidos = this.nextElementSibling; // tabla de solicitudes
		this.setTable(pedidos); // set table to reload

		this.addEventListener("submit", ev => {
			this.isChanged() && this.list();
			ev.preventDefault();
			this.setChanged();
		});

		this.elements.ej.setLabels(sb.getEjercicios()); // ultimos 6 ej
		this.elements.firma.value = "5"; // firma en estado pendiente
		tabs.setAction("relist", this.relist); // reload list with default filter
		tabs.setAction("list", () => { // prepare list tab
			pedidos.getNumRenders() || this.list(); // fetch list for first access
			tabs.showList(); // show list tab
		});
	}
}
