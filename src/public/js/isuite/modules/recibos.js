
import sb from "../../components/types/StringBox.js";
import Form from "../../components/forms/Form.js";
import Accordion from "../../components/Accordion.js";
import Table from "../../components/Table.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";
import recibo from "../model/Recibo.js";

function Recibos() {
	const form = new Form("#ttpp"); // filtro del historico de recibos
	const accordion = new Accordion(form.getNextElement()); // historico de recibos

	const fnBuscar = () => {
		const url = "/uae/ttpp/historico?" + form.getUrlParams().toString();
		api.init().json(url).then(accordion.setData).then(accordion.replace);
	}

	this.init = () => {
		form.setLabels("#ejercicios", sb.getEjercicios()); // ultimos 6 ej
		accordion.setRender(recibo.accordion); // render template
		accordion.setOpen((data, details) => {
			if (details.openings)
				return; // recibos ya cargados
			api.init().json("/uae/ttpp/historico/recibos?id=" + data.id).then(recibos => {
				const tblRecibos = new Table(); // instance new table dynamically
				details.lastElementChild.appendChild(tblRecibos.setOptions(recibo.getTable()).getTable()); // append table to details
				tblRecibos.setHeader(recibo.thead()).setFooter(recibo.tfoot()).addClass("tb-xeco").view(recibos); // build table contents
			});
		});

		fnBuscar();
	}

	tabs.setAction("list", () => {
		form.isChanged() && fnBuscar();
		form.setChanged();
	});

	tabs.setAction("relist", () => {
		form.setData({ ej: 2025, tipo: 43, fecha: "" });
		fnBuscar();
	});
}

export default new Recibos();
