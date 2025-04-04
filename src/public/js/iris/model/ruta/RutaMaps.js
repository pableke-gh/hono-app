
import i18n from "../../../i18n/langs.js";
import iris from "../Iris.js";

function RutaMaps() {
	this.row = (data, status, resume) => {
		const destino = iris.isEditable() ? `<a href="#main" class="row-action">${data.destino}${resume.flag}</a>` : `${data.destino}${resume.flag}`;
		const remove = iris.isEditable() ? '<a href="#remove" class="row-action"><i class="fas fa-times action text-red resize"></i></a>' : ""; // #{iris.form.editableP0}
		return `<tr class="tb-data tb-data-tc">
			<td class="hide-sm" data-cell="Nº">${status.count}</td>
			<td data-cell="Origen">${data.origen}</td>
			<td data-cell="#{msg['lbl.fecha.salida']}">${i18n.isoDate(data.dt1)}</td>
			<td data-cell="#{msg['lbl.hora.salida']}">${i18n.isoTimeShort(data.dt1)}</td>
			<td data-cell="Destino">${destino}</td>
			<td data-cell="#{msg['lbl.fecha.llegada']}">${i18n.isoDate(data.dt2)}</td>
			<td data-cell="#{msg['lbl.hora.llegada']}">${i18n.isoTimeShort(data.dt2)}</td>
			<td data-cell="#{msg['lbl.medio.trans']}">${i18n.getItem("tiposDesp", data.desp)}</td>
			<td class="hide-sm" data-cell="Km.">${i18n.isoFloat(data.km2) || "-"}</td>
			<td class="no-print" data-cell="Acciones">${remove}</td>
		</tr>`;
	}

	this.tfoot = resume => {
		const totKmCalc = (resume.totKmCalc > 0) ? i18n.isoFloat(resume.totKmCalc) : "-";
		return `<tr>
			<td colspan="8">Etapas: ${resume.size}</td>
			<td class="tb-data-tc hide-xs hide-sm">${totKmCalc}</td>
			<td class="hide-sm no-print"></td>
		</tr>`;
	}
}

export default new RutaMaps();
