
import sb from "../../components/types/StringBox.js";
import FormHTML from "../../components/forms/FormHTML.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";
import Accordion from "../components/accordion.js";

export default class Recibos extends FormHTML {
	constructor() {
		super(); // Must call super before 'this'

		// Table default initialization
		this.getElement("ej").setLabels(sb.getEjercicios()); // ultimos 6 ej
		tabs.setInitEvent("ttpp", this.accordion); // pre-load data on view
		tabs.setAction("list", () => { this.isChanged() && this.accordion(); });
		tabs.setAction("relist", () => this.setData({ ej: sb.getYear(), tipo: 43, fecha: "" }).accordion());
	}

	accordion = () => {
		const url = "/uae/ttpp/historico?" + this.getUrlParams().toString();
		api.init().json(url).then(this.nextElementSibling.setData); // update accordion
		this.setChanged(); // reset indicator
	}
}

customElements.define("recibos-accordion", Accordion, { extends: "div" });
