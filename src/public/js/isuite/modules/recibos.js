
import sb from "../../components/types/StringBox.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";

import FormHTML from "../../core/components/forms/Form.js";
import Accordion from "../components/Accordion.js";

export default class Recibos extends FormHTML {
	connectedCallback() {
		super.connectedCallback(); // init. component

		// Table default initialization
		this.elements.ej.setLabels(sb.getEjercicios()); // ultimos 6 ej
		tabs.setInitEvent("ttpp", this.accordion); // pre-load data on view
		tabs.setAction("list", () => { this.isChanged() && this.accordion(); });
		tabs.setAction("relist", () => this.load({ ej: sb.getYear(), tipo: 43, fecha: "" }).accordion());
	}

	accordion = () => {
		const url = "/uae/ttpp/historico?" + this.getUrlParams().toString();
		api.init().json(url).then(this.nextElementSibling.setData); // update accordion
		this.setChanged(); // reset indicator
	}
}

customElements.define("recibos-accordion", Accordion, { extends: "div" });
