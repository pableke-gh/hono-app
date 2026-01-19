
import i18n from "../../i18n/langs.js";
import ruta from "./Ruta.js";

function RutaReadOnly() {
	const self = this; //self instance

	this.beforeRender = ruta.beforeRender;
	this.rowCalc = ruta.rowCalc;

	this.row = (data, status, resume) => { 
		self.rowCalc(data, resume);
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº" class="hide-sm">${status.count}</td>
			<td data-cell="${i18n.get("lblOrigen")}">${data.origen}</td>
			<td data-cell="${i18n.get("lblFechaSalida")}">${i18n.isoDate(data.dt1)}</td>
			<td data-cell="${i18n.get("lblHoraSalida")}">${i18n.isoTimeShort(data.dt1)}</td>
			<td data-cell="${i18n.get("lblDestino")}">${data.destino}${data.spanFlag}</td>
			<td data-cell="${i18n.get("lblFechaLlegada")}">${i18n.isoDate(data.dt2)}</td>
			<td data-cell="${i18n.get("lblHoraLlegada")}">${i18n.isoTimeShort(data.dt2)}</td>
			<td data-cell="${i18n.get("lblTransporte")}">${i18n.getItem("tiposDesp", data.desp)}</td>
			<td data-cell="Km." class="hide-sm">${i18n.isoFloat(data.km2) || "-"}</td>
		</tr>`;
	}

	this.afterRender = resume => {
		resume.totKmCalcFmt = (resume.totKmCalc > 0) ? i18n.isoFloat(resume.totKmCalc) : "-";
	}

	this.getTable = () => ({ msgEmptyTable: "msgRutasEmpty", beforeRender: self.beforeRender, rowCalc: self.rowCalc, onRender: self.row, afterRender: self.afterRender });
}

export default new RutaReadOnly();
