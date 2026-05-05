
import sb from "../../components/types/StringBox.js";
import FormHTML from "../../components/forms/FormHTML.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";

export default class ControlesFilterForm extends FormHTML {
	getSolicitudes = () => this.nextElementSibling; // tabla de solicitudes
	connectedCallback() {
		const pedidos = this.nextElementSibling; // tabla de solicitudes
		const fnCallList = () => { // fetch list action
			const fnThen = data => pedidos.render(data); // rebuild table
			api.setJSON(this.getData()).json("/uae/pedidos/controles").then(fnThen);
		}
		const fnList = (ej, tipo) => {
			this.setData({ ej, tipo });
			fnCallList(); // prepare filter and fetch
		}

		this.onSubmit(ev => {
			ev.preventDefault();
			this.isChanged() && fnCallList();
			this.setChanged();
		});

		this.getElement("ej").setLabels(sb.getEjercicios()); // ultimos 6 ej
		tabs.setAction("recontrol", () => fnList(sb.getYear(), this.getValue("tipo")));
		tabs.setAction("ctrl", link => {
			if (pedidos.isEmpty() || (link.dataset.tipo != this.getValue("tipo")))
				fnList("", link.dataset.tipo); // load table
			tabs.show("controles");
		});
	}
}
