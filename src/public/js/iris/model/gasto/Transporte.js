
import i18n from "../../i18n/langs.js";
import gasto from "./Gasto.js";

function Transporte() {
	const self = this; //self instance

	this.beforeRender = resume => {
		resume.num = resume.imp1 = 0;
	}

	this.rowCalc = (data, resume) => {
		resume.num += data.num;
		resume.imp1 += data.imp1;
	}

	this.row = (data, status, resume) => {
		self.rowCalc(data, resume);
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº">${status.count}</td>
			<td data-cell="#{msg['lbl.tipo.gasto']}">${gasto.getDescSubtipo(data)}</td>
			<td data-cell="#{msg['lbl.desc.obsev']}">${gasto.getDescGasto(data)}</td>
			<td data-cell="#{msg['lbl.adjunto']}">${data.nombre}</td>
			<td data-cell="${i18n.get("lblImporte")}">${i18n.isoFloat(data.imp1)} €</td>
		</tr>`
	}

	this.tfoot = resume => {
		return `<tr>
			<td colspan="4">Facturas / Tickets: ${resume.size}</td>
			<td class="tb-data-tc hide-xs">${i18n.isoFloat(resume.imp1)} €</td>
		</tr>`;
	}

	const msgEmptyTable = "msgTransportesEmpty"; // #{msg['msg.no.fac.tickets']} 
	this.getTable = () => ({ msgEmptyTable, beforeRender: self.beforeRender, rowCalc: self.rowCalc, onRender: self.row, onFooter: self.tfoot });
}

export default new Transporte();
