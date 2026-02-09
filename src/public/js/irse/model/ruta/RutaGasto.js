
import i18n from "../../../i18n/langs.js";
import ruta from "./Ruta.js";

class RutaGasto {
	beforeRender = ruta.beforeRender;
	rowCalc = ruta.rowCalc;

	row = (data, status) => {
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº" class="hide-sm">${status.count}</td>
			<td data-cell="${i18n.get("lblOrigen")}">${data.origen}</td>
			<td data-cell="${i18n.get("lblFechaSalida")}">${i18n.isoDate(data.dt1)}</td>
			<td data-cell="${i18n.get("lblHoraSalida")}">${i18n.isoTimeShort(data.dt1)}</td>
			<td data-cell="${i18n.get("lblDestino")}">${data.destino}${data.spanFlag}</td>
			<td data-cell="${i18n.get("lblFechaLlegada")}">${i18n.isoDate(data.dt2)}</td>
			<td data-cell="${i18n.get("lblHoraLlegada")}">${i18n.isoTimeShort(data.dt2)}</td>
			<td data-cell="${i18n.get("lblTransporte")}">${i18n.getItem("tiposDesp", data.desp)}</td>
			<td data-cell="Asociar Etapa"><input type="checkbox" value="${data.id}"/></td>
		</tr>`;
	}

	getTable = () => ({ msgEmptyTable: "msgRutasEmpty", beforeRender: this.beforeRender, rowCalc: this.rowCalc, onRender: this.row });
}

export default new RutaGasto();
