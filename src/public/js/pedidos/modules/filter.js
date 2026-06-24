
import api from "../../core/components/Api.js";
import sb from "../../components/types/StringBox.js";
import tabs from "../../core/components/helpers/Tabs.js";
import FormHTML from "../../core/components/forms/Form.js";

export default class PedidoFilterForm extends FormHTML {
	getSolicitudes = () => this.nextElementSibling; // tabla de solicitudes
	connectedCallback() {
		super.connectedCallback(); // initialize form
		const pedidos = this.nextElementSibling; // tabla de solicitudes
		const fnCallList = () => { // fetch list action
			const fnThen = data => pedidos.render(data); // show data
			api.setJSON(this.getData()).json("/uae/pedidos/list").then(fnThen);
		}
		const fnList = (ej, firma) => {
			this.load({ ej, firma }, true, ".ui-filter");
			fnCallList(); // prepare filter and fetch
		}

		this.addEventListener("submit", ev => {
			this.isChanged() && fnCallList();
			ev.preventDefault();
			this.setChanged();
		});

		this.getElement("ej").setLabels(sb.getEjercicios()); // ultimos 6 ej
		tabs.setInitEvent("list", () => fnList("", "5"));
		//tabs.setAction("list-all", () => { this.reset(".ui-filter"); fnCallList(); });
		tabs.setAction("relist", () => fnList(sb.getYear(), "5"));
	}
}
