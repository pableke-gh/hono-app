
import TableHTML from "../../../components/TableHTML.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js"
import gasto from "../../model/Gasto.js";
import gastos from "../../model/Gastos.js";
import form from "../irse.js"

const MAX_CENA_FIN_G1 = 26.67;
const MAX_CENA_FIN_G2 = 18.70;

// tabla del paso 6 resumen de gastos extraordinarios
export default class Extraordinarios extends TableHTML {
	init() {
		this.setMsgEmpty("No existen gastos extraordinarios asociados a la comunicación."); // msg.no.gastos.extra
		irse.getImpExtra = this.getImporte;
		irse.getImpExtraTrans = this.getImpTransporte;
		irse.getImpExtraPernoctas = this.getImpPernoctas;
		irse.getImpExtraDietas = this.getImpDietas;
		irse.getImpCena = this.getImpCena;
	}

	getImporte = () => this.getProp("imp1");
	getImpTransporte = () => this.getProp("trans");
	getImpPernoctas = () => this.getProp("pernocta");
	getImpDietas = () => this.getProp("dieta");
	getImpCena = () => this.getProp("cena");
	getMaxCena() {
		if (form.getOrganicas().isRD()) // is RD
			return ((form.getPaso1().getGrupoDieta() == 1) ? MAX_CENA_FIN_G1 : MAX_CENA_FIN_G2);
		return MAX_CENA_FIN_G1;
	}
	isCena = () => (this.getImpCena() < this.getMaxCena())

	beforeRender(resume) {
		resume.imp1 = resume.trans = resume.pernocta = resume.dieta = resume.cena = 0;
	}
	beforeRow(data, resume) {
		resume.imp1 += data.imp1;
		resume.trans += gasto.isExtraTrans(data) ? data.imp1 : 0;
		resume.pernocta += gasto.isExtraPernocta(data) ? data.imp1 : 0;
		resume.cena += gasto.isCenaFin(data) ? data.imp1 : 0;
		resume.dieta += gasto.isExtraDieta(data) ? data.imp1 : 0;
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
