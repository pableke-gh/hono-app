
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

	relist() {
		this.elements.ej.value = sb.getYear(); // ej actual
		this.list(); // fetch list
	}

	ctrl(tipo) {
		const pedidos = this.getPedidos(); // tabla de pedidos
		const isChanged = pedidos.isEmpty() || (tipo != this.elements.tipo.value);
		this.elements.tipo.value = tipo; // set tipo
		isChanged && this.list(); // fetch list if changed
		tabs.show("ctrl");
	}
	ctrl1() { this.ctrl(1); }
	ctrl2() { this.ctrl(2); }
	ctrl3() { this.ctrl(3); }
	ctrl4() { this.ctrl(4); }
	ctrl5() { this.ctrl(5); }

	connectedCallback() {
		super.connectedCallback(); // initialize form
		this.elements.ej.setLabels(sb.getEjercicios()); // ultimos 6 ej

		this.addEventListener("submit", ev => {
			this.isChanged() && this.list();
			ev.preventDefault();
			this.setChanged();
		});
	}
}
