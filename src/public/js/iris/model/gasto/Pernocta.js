
import i18n from "../../i18n/langs.js";

function Pernocatas() {

	this.beforeRender = resume => {
		resume.numNoches = 0;
	}
	this.row = (data, status, resume) => {
		resume.numNoches += data.num;
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº">${status.count}</td>
			<td data-cell="#{msg['lbl.pais']}">${data.desc}</td>
			<td data-cell="#{msg['lbl.fecha.inicio']}">${i18n.isoDate(data.f1)}</td>
			<td data-cell="#{msg['lbl.fecha.fin']}">${i18n.isoDate(data.f2)}</td>
			<td data-cell="#{msg['lbl.noches']}">${data.num}</td>
			<td data-cell="#{msg['lbl.imp.noche']}">#{irse.gastos.getGastoImpCalc(g)} €</td>
			<td data-cell="#{msg['lbl.imp.tot']}">#{irse.gastos.getImpCalcPernoctaI18n(g)} €</td>
			<td data-cell="#{msg['lbl.imp.justifi']}">#{irse.gastos.getGastoImporte(g)} €</td>
			<td data-cell="#{msg['lbl.imp.percibir']}">#{irse.form.getMinPernoctaI18n(g)} €</td>
		</tr>`
	}
	this.tfoot = resume => {
		return `<tr>
			<td colspan="4">Alojamientos: ${resume.size}</td>
			<td class="tb-data-tc hide-xs">${resume.numNoches}</td>
			<td class="hide-xs"></td>
			<td class="tb-data-tc hide-xs">#{irse.gastos.maxPernoctasI18n} €</td>
			<td class="tb-data-tc hide-xs">#{irse.gastos.impPernoctasI18n} €</td>
			<td class="tb-data-tc hide-xs">#{irse.gastos.minPernoctasI18n} €</td>
		</tr>`;
	}
}

export default new Pernocatas();
