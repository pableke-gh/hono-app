
import i18n from "../../../i18n/langs.js";

function Transporte() {

	this.beforeRender = resume => {
		resume.num = resume.imp1 = 0;
	}
	this.row = (data, status, resume) => {
		resume.num += data.num;
		resume.imp1 += data.imp1;
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº">${status.count}</td>
			<td data-cell="#{msg['lbl.tipo.gasto']}">#{irse.gastos.getSubtipoDesc(g)}</td>
			<td data-cell="#{msg['lbl.desc.obsev']}">#{irse.gastos.getDescGasto(g)}</td>
			<td data-cell="#{msg['lbl.adjunto']}">${data.nombre}</td>
			<td data-cell="#{msg['lbl.importe']}">${i18n.isoFloat(data.imp1)} €</td>
		</tr>`
	}
	this.tfoot = resume => {
		return `<tr>
			<td colspan="4">Facturas / Tickets: ${resume.size}</td>
			<td class="tb-data-tc hide-xs">${i18n.isoFloat(resume.imp1)} €</td>
		</tr>`;
	}
}

export default new Transporte();
