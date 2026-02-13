
import i18n from "../../i18n/langs.js";
import gasto from "./Gasto.js";

class Transporte {
	beforeRender(resume) {
		resume.num = resume.imp1 = 0;
	}

	rowCalc(data, resume) {
		resume.num += data.num;
		resume.imp1 += data.imp1;
	}

	row = (data, resume) => `<tr class="tb-data tb-data-tc">
		<td data-cell="Nº">${resume.count}</td>
		<td data-cell="${i18n.get("lblTipoGasto")}">${gasto.getDescSubtipo(data)}</td>
		<td data-cell="${i18n.get("lblDescObserv")}">${gasto.getDescGasto(data)}</td>
		<td data-cell="${i18n.get("lblAdjunto")}">${data.nombre}</td>
		<td data-cell="${i18n.get("lblImporte")}">${i18n.isoFloat(data.imp1)} €</td>
	</tr>`

	getTable = () => ({
		msgEmptyTable: "msgTransportesEmpty", // #{msg['msg.no.fac.tickets']} 
		beforeRender: this.beforeRender, rowCalc: this.rowCalc, onRender: this.row
	});
}

export default new Transporte();
