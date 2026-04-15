
import sb from "../../components/types/StringBox.js";
import FormHTML from "../../components/forms/FormHTML.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"

// Filter se ejecuta antes que la tabla de solicitudes
export default class FilterForm extends FormHTML {
	getSolicitudes = () => this.nextElementSibling; // tabla de solicitudes
	connectedCallback() { // aun no se ha instanciado la tabla de solicitudes
		const fnCallList = () => { // fetch list action
			const url = this.getSolicitudes().getSolicitud().getUrl() + "/list";
			api.setJSON(this.getData()).json(url).then(data => {
				this.getSolicitudes().render(data);
				tabs.showList();
			});
		}
		const fnList = (estado, fmask) => {
			this.setData({ estado, fmask }, ".ui-filter");
			fnCallList(); // prepare filter and fetch
		}

		this.onSubmit(ev => {
			ev.preventDefault();
			this.isChanged() && fnCallList();
			this.setChanged();
		});

		this.getElement("ej").setLabels(sb.getEjercicios()); // ultimos 6 ej
		tabs.setInitEvent("list", () => { this.getSolicitudes().isEmpty() && fnList("", "5"); });
		tabs.setAction("list-all", () => { this.reset(".ui-filter"); fnCallList(); });
		tabs.setAction("relist", () => fnList("", "5"));
		tabs.setAction("vinc", () => { ("1" == this.getValue("estado")) ? tabs.showList() : fnList("1"); });

		// global tabs actions
		tabs.setAction("clickNext", link => link.nextElementSibling.click()); // fire click event for next sibling element
		tabs.setAction("closeModal", link => link.closest("dialog").close()); // close modal action
	}
}
