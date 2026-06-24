
import sb from "../../components/types/StringBox.js";
import api from "../../core/components/Api.js";
import tabs from "../../core/components/helper/Tabs.js";
import FormHTML from "../../core/components/forms/Form.js";

export default class ControlesFilterForm extends FormHTML {
	connectedCallback() {
		super.connectedCallback(); // initialize form
		const pedidos = this.nextElementSibling; // tabla de pedidos
		const fnCallList = () => { // fetch list action
			const fnThen = data => pedidos.render(data); // rebuild table
			api.setJSON(this.getData()).json("/uae/pedidos/controles").then(fnThen);
		}
		const fnList = (ej, tipo) => {
			this.load({ ej, tipo }, true);
			fnCallList(); // prepare filter and fetch
		}

		this.addEventListener("submit", ev => {
			this.isChanged() && fnCallList();
			ev.preventDefault();
			this.setChanged();
		});

		this.getElement("ej").setLabels(sb.getEjercicios()); // ultimos 6 ej
		tabs.setAction("recontrol", () => fnList(sb.getYear(), this.getValue("tipo")));
		tabs.setAction("ctrl", link => {
			if (pedidos.isEmpty() || link.dataset.tipo != this.getValue("tipo"))
				fnList("", link.dataset.tipo); // load table
			tabs.show("controles");
		});
	}
}
