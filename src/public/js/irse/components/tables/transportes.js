
import TableHTML from "../../../core/components/tables/Table.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js"
import gasto from "../../model/Gasto.js";
import gastos from "../../model/Gastos.js";

// tabla del paso 6 resumen de transportes
export default class Transportes extends TableHTML {
	connectedCallback() {
		this.setMsgEmpty("No existen gastos de transporte asociados a la comunicación."); // msg.no.gastos.extra
		irse.getImpTransporte = this.getImporte;
	}

	getImporte = () => this.getProp("imp1");
	hide = () => this.parentNode.classList.add("hide"); // arrow final function
	show = () => this.parentNode.classList.remove("hide"); // arrow final function

	beforeRender(resume) {
		resume.num = resume.imp1 = 0;
	}
	beforeRow(data, i, resume) {
		resume.num += data.num;
		resume.imp1 += data.imp1;
	}
	row(data, i) {
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº">${i + 1}</td>
			<td data-cell="${i18n.get("lblTipoGasto")}">${gasto.getDescSubtipo(data)}</td>
			<td data-cell="${i18n.get("lblDescObserv")}">${gasto.getDescGasto(data)}</td>
			<td data-cell="${i18n.get("lblAdjunto")}">${data.nombre}</td>
			<td data-cell="${i18n.get("lblImporte")}">${i18n.isoFloat(data.imp1)} €</td>
		</tr>`
	}
	afterRender(resume) {
		this.setVisible(resume.imp1 > 0); // mostrar grupo
	}

	render() {
		super.render(gastos.getTransporte());
	}
}
