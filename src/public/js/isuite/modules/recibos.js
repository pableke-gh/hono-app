
import sb from "../../components/types/StringBox.js";
import tabs from "../../core/components/tabs/Tabs.js";
import api from "../../core/components/Api.js";

import FormHTML from "../../core/components/forms/Form.js";
import RecibosAccordion from "../components/acordeones/Recibos.js";

export default class Recibos extends FormHTML {
	connectedCallback() {
		super.connectedCallback(); // init. component
		this.elements.ej.setLabels(sb.getEjercicios()); // ultimos 6 ej
		this.addEventListener("reset", ev => setTimeout(this.accordion, 1));
		this.addEventListener("submit", ev => {
			this.isChanged() && this.accordion();
			ev.preventDefault();
		});

		tabs.setAction("ttpp", () => {
			tabs.isLoaded("ttpp") || this.accordion();
			tabs.show("ttpp");
		});
	}

	accordion = () => {
		const url = "/uae/ttpp/historico?" + this.getUrlParams().toString();
		api.init().json(url).then(data => this.nextElementSibling.setData(data).renderTabs()); // update accordion
		this.setChanged(); // reset indicator
	}
}

customElements.define("recibos-accordion", RecibosAccordion, { extends: "div" });
