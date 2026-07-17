
import sb from "../../../components/types/StringBox.js";
import api from "../../../core/components/Api.js";
import tabs from "../../../core/components/tabs/Tabs.js";
import FormHTML from "../../../core/components/forms/Form.js";

export default class ControlesFilter extends FormHTML {
	getRegistros = () => this.nextElementSibling; // tabla de solicitudes / registros
	getPedidos = () => this.nextElementSibling; // tabla de solicitudes / registros

	list() {
		const fnThen = data => this.getPedidos().render(data); // rebuild table
		api.setJSON(this.getData()).json("/uae/pedidos/controles").then(fnThen);
	}

	relist = () => {
		this.elements.ej.value = sb.getYear(); // ej actual
		this.list(); // fetch list
	}

	connectedCallback() {
		super.connectedCallback(); // initialize form

		this.addEventListener("submit", ev => {
			this.isChanged() && this.list();
			ev.preventDefault();
			this.setChanged();
		});

		this.elements.ej.setLabels(sb.getEjercicios()); // ultimos 6 ej
		tabs.setAction("rectrl", this.relist);
		tabs.setAction("ctrl", link => {
			const pedidos = this.getPedidos(); // tabla de pedidos
			const isChanged = pedidos.isEmpty() || (link.dataset.tipo != this.elements.tipo.value);
			this.elements.tipo.value = link.dataset.tipo; // set tipo
			isChanged && this.list(); // fetch list if changed
			tabs.show("ctrl");
		});
	}
}
