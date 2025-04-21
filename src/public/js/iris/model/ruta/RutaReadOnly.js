
import i18n from "../../../i18n/langs.js";
import ruta from "./Ruta.js";

function RutaReadOnly() {
	const self = this; //self instance

	this.beforeRender = ruta.beforeRender;
	this.rowCalc = ruta.rowCalc;

	this.row = (data, status, resume) => { 
		self.rowCalc(data, resume);
		return `<tr class="tb-data tb-data-tc">
			<td class="hide-sm" data-cell="Nº">${status.count}</td>
			<td data-cell="Origen">${data.origen}</td>
			<td data-cell="#{msg['lbl.fecha.salida']}">${i18n.isoDate(data.dt1)}</td>
			<td data-cell="#{msg['lbl.hora.salida']}">${i18n.isoTimeShort(data.dt1)}</td>
			<td data-cell="Destino">${data.destino}${data.spanFlag}</td>
			<td data-cell="#{msg['lbl.fecha.llegada']}">${i18n.isoDate(data.dt2)}</td>
			<td data-cell="#{msg['lbl.hora.llegada']}">${i18n.isoTimeShort(data.dt2)}</td>
			<td data-cell="#{msg['lbl.medio.trans']}">${i18n.getItem("tiposDesp", data.desp)}</td>
			<td class="hide-sm" data-cell="Km.">${i18n.isoFloat(data.km2) || "-"}</td>
		</tr>`;
	}

	this.tfoot = resume => {
		const totKmCalc = (resume.totKmCalc > 0) ? i18n.isoFloat(resume.totKmCalc) : "-";
		return `<tr>
			<td colspan="8">Etapas: ${resume.size}</td>
			<td class="tb-data-tc hide-xs hide-sm">${totKmCalc}</td>
		</tr>`;
	}

	this.getTable = () => ({ msgEmptyTable: "msgRutasEmpty", beforeRender: self.beforeRender, rowCalc: self.rowCalc, onRender: self.row, onFooter: self.tfoot });
}

export default new RutaReadOnly();
