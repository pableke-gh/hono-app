
import i18n from "../../../i18n/langs.js";

function RutaReadOnly() {
	this.row = (data, status, resume) => { 
		return `<tr class="tb-data tb-data-tc">
			<td class="hide-sm" data-cell="Nº">${status.count}</td>
			<td data-cell="Origen">${data.origen}</td>
			<td data-cell="#{msg['lbl.fecha.salida']}">${i18n.isoDate(data.dt1)}</td>
			<td data-cell="#{msg['lbl.hora.salida']}">${i18n.isoTimeShort(data.dt1)}</td>
			<td data-cell="Destino">${data.destino}${resume.flag}</td>
			<td data-cell="#{msg['lbl.fecha.llegada']}">${i18n.isoDate(data.dt2)}</td>
			<td data-cell="#{msg['lbl.hora.llegada']}">${i18n.isoTimeShort(data.dt2)}</td>
			<td data-cell="#{msg['lbl.medio.trans']}">${i18n.getItem("tiposDesp", data.desp)}</td>
			<td class="hide-sm" data-cell="Km.">${i18n.isoFloat(data.km2) || "-"}</td>
		</tr>`;
	}
}

export default new RutaReadOnly();
