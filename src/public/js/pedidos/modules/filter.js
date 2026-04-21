
import sb from "../../components/types/StringBox.js";
import FormHTML from "../../components/forms/FormHTML.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";

export default class PedidoFilterForm extends FormHTML {
	getSolicitudes = () => this.nextElementSibling; // tabla de solicitudes
	connectedCallback() {
		const pedidos = this.nextElementSibling; // tabla de solicitudes
		const fnCallList = () => { // fetch list action
			/*api.setJSON(this.getData()).json("/uae/pedidos/list").then(data => {
				pedidos.render(data);
			});*/
			pedidos.view();
		}
		const fnList = (ej, fmask) => {
			this.setData({ ej, fmask }, ".ui-filter");
			fnCallList(); // prepare filter and fetch
		}

		this.onSubmit(ev => {
			ev.preventDefault();
			this.isChanged() && fnCallList();
			this.setChanged();
		});

		this.getElement("ej").setLabels(sb.getEjercicios()); // ultimos 6 ej
		tabs.setInitEvent("list", () => { pedidos.isEmpty() && fnList("", "5"); });
		//tabs.setAction("list-all", () => { this.reset(".ui-filter"); fnCallList(); });
		tabs.setAction("relist", () => fnList(sb.getYear(), "5"));

		// global tabs actions
		tabs.setAction("clickNext", link => link.nextElementSibling.click()); // fire click event for next sibling element
		tabs.setAction("closeModal", link => link.closest("dialog").close()); // close modal action
	}
}
