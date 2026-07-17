
import Accordion from "../../../core/components/accordions/Accordion.js";
import api from "../../../core/components/Api.js";
import i18n from "../../i18n/langs.js";
import RecibosTable from "../tablas/Recibos.js";

export default class RecibosAccordion extends Accordion {
	onOpen(tab) {
		const div = tab.lastElementChild;
		if (div.children.length > 0)
			return; // recibos ya cargados
		api.init().json("/uae/ttpp/historico/recibos?id=" + tab.id).then(recibos => {
			const table = new RecibosTable(); // instance new recibos-table dynamically
			div.appendChild(table.view(recibos)); // append table to details
		});
	}

	summary(el, data, status) {
		el.parentNode.id = data.id; // set id for details/tab element
		el.innerHTML = `${status.count}. Recibos del ${i18n.isoDate(data.f1)} al ${i18n.isoDate(data.f2)} (N${data.tipo})`;
	}
}

customElements.define("recibos-table", RecibosTable, { extends: "table" });
