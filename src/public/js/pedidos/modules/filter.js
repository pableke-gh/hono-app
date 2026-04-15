
import sb from "../../components/types/StringBox.js";
import FormHTML from "../../components/forms/FormHTML.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";

export default class FilterForm extends FormHTML {
	connectedCallback() {
		this.getElement("ej").setLabels(sb.getEjercicios()); // ultimos 6 ej
		tabs.setAction("list", () => { this.isChanged() && this.accordion(); });
		tabs.setAction("relist", () => this.setData({ ej: sb.getYear(), tipo: 43, fecha: "" }).accordion());

		// global tabs actions
		tabs.setAction("clickNext", link => link.nextElementSibling.click()); // fire click event for next sibling element
		tabs.setAction("closeModal", link => link.closest("dialog").close()); // close modal action
	}
}
