
import Table from "../../components/Table.js";
import i18n from "../i18n/langs.js";

import presto from "../model/Presto.js";
import partida from "../model/Partida.js";
import p030 from "./partida030.js";

class Partidas extends Table {
	constructor() {
		super(p030.querySelector("#partidas-inc"));
		this.setMsgEmpty("No existen partidas a incrementar asociadas a la solicitud").set("#doc030", p030.view);
		presto.showPartidasInc = () => (presto.isTipoMultipartida() && presto.isEditable() && (this.size() < 20));
	}

	// Importante! el total requiere redondeo para las validaciones con el impoerte a decrementar
	getImporte = () => this.getProp("imp").round(2); // redondear si hay muchas partidas con decimales
	setPrincipal = () => {
		const data = this.getData();
		data.sort((a, b) => (b.imp - a.imp)); //orden por importe desc.
		partida.setPrincipal(data[0]); // marco la primera como principal
		return this;
	}

	beforeRender(resume) { resume.imp = 0; }
	rowCalc(data, resume) { resume.imp += data.imp; }
	row(data) {
		const NO_APLICA = "N/A"; // default table float
		const css = presto.isPartidaExt() ? "currency" : "hide";
		const excedido = partida.isExcedida(data) ? '<span class="text-warn text-xl" title="La cantidad solicitada excede el margen registrado por el Buzón de Ingresos">&#9888;</span>' : "";
		const anticipada = partida.isAnticipada(data) ? '<span class="text-xl" title="Este contrato ha gozado de anticipo en algún momento">&#65;</span>' : "";
		const doc030 = presto.is030() ? '<a href="#doc030" class="fal fa-money-bill-alt action resize text-green" title="Asociar los datos del documento 030"></a>' : "";
		const remove = (presto.isEditable() && !presto.isAfc()) ? '<a href="#remove" class="fas fa-times action resize text-red" title="Desasociar partida"></a>' : "";

		return `<tr class="tb-data">
			<td class="text-center">${excedido}${anticipada}</td>
			<td class="text-center">${data.ej}</td>
			<td>${data.o}</td>
			<td class="hide-sm">${data.dOrg}</td>
			<td class="text-center hide-sm">${i18n.boolval(partida.isAfectada(data.omask))}</td>
			<td class="text-center">${data.e}</td>
			<td class="hide-sm">${data.dEco}</td>
			<td class="${css}">${i18n.isoFloat(data.ing) || NO_APLICA} €</td>
			<td class="${css}">${i18n.isoFloat(data.gg) || NO_APLICA} €</td>
			<td class="${css}">${i18n.isoFloat(data.mh) || NO_APLICA} €</td>
			<td class="${css}">${i18n.isoFloat(data.ch) || NO_APLICA} €</td>
			<td class="${css}">${i18n.isoFloat(data.ih) || NO_APLICA} €</td>
			<td class="currency">${i18n.isoFloat(data.imp)} €</td>
			<td class="text-center">${doc030}${remove}</td>
		</tr>`;
	}
	afterRender() {
		p030.setEditable(presto);
	}
}

export default new Partidas();
