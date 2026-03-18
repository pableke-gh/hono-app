
import Accordion from "../../components/Accordion.js";
import api from "../../components/Api.js";
import i18n from "../i18n/langs.js";
import Recibos from "./recibos.js";

export default class RecibosAccordion extends Accordion {
	render = (data, status) => `<details>
		<summary>${status.count}. Recibos del ${i18n.isoDate(data.f1)} al ${i18n.isoDate(data.f2)} (N${data.tipo})</summary>
		<div></div>
	</details>`;

	onOpen = (data, details) => {
		if (details.openings)
			return; // recibos ya cargados
		api.init().json("/uae/ttpp/historico/recibos?id=" + data.id).then(recibos => {
			const RecibosTable = customElements.get("recibos-table"); // get custom class
			const tblRecibos = new RecibosTable(); // instance new recibos-table dynamically
			details.lastElementChild.appendChild(tblRecibos.view(recibos)); // append table to details
		});
	}
}

customElements.define("recibos-table", Recibos, { extends: "table" });
