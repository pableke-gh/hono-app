
import Table from "../../../components/Table.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js"
import gasto from "../../model/Gasto.js";
import gastos from "../../model/Gastos.js";

// tabla del paso 6 resumen de gastos extraordinarios
export default class Extraordinarios extends Table {
	constructor(form) {
		super(form.querySelector("#extra"));
		this.setMsgEmpty("No existen gastos extraordinarios asociados a la comunicación."); // msg.no.gastos.extra
	}

	init() {
		irse.getImpExtra = this.getImporte;
	}

	getImporte = () => this.getProp("imp1");

	beforeRender(resume) {
		resume.imp1 = 0;
	}

	rowCalc(data, resume) {
		resume.imp1 += data.imp1;
	}

	row = (data, resume) => `<tr class="tb-data tb-data-tc">
		<td data-cell="Nº">${resume.count}</td>
		<td data-cell="${i18n.get("lblTipoGasto")}">${gasto.getDescSubtipo(data)}</td>
		<td data-cell="${i18n.get("lblDescObserv")}">${gasto.getDescGasto(data)}</td>
		<td data-cell="${i18n.get("lblAdjunto")}">${data.nombre}</td>
		<td data-cell="${i18n.get("lblImporte")}">${i18n.isoFloat(data.imp1)} €</td>
	</tr>`;

	render() {
		super.render(gastos.getExtra());
	}
}
