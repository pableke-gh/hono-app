
import Accordion from "../../core/components/Accordion.js";
import api from "../../components/Api.js";
import i18n from "../i18n/langs.js";
import Recibos from "./Recibos.js";

export default class RecibosAccordion extends Accordion {
	render = (data, status) => `<details>
		<summary>${status.count}. Recibos del ${i18n.isoDate(data.f1)} al ${i18n.isoDate(data.f2)} (N${data.tipo})</summary>
		<div></div>
	</details>`;

	onOpen(data, details) {
		const div = details.lastElementChild;
		if (div.children.length > 0)
			return; // recibos ya cargados
		api.init().json("/uae/ttpp/historico/recibos?id=" + data.id).then(recibos => {
			const tblRecibos = new Recibos(); // instance new recibos-table dynamically
			div.appendChild(tblRecibos.view(recibos)); // append table to details
		});
	}
}

customElements.define("recibos-table", Recibos, { extends: "table" });
