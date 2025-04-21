
import i18n from "../../../i18n/langs.js";
import ruta from "./Ruta.js";

function RutaGasto() {
	const self = this; //self instance

	this.beforeRender = ruta.beforeRender;
	this.rowCalc = ruta.rowCalc;

	this.row = (data, status) => {
		return `<tr class="tb-data tb-data-tc">
			<td class="hide-sm" data-cell="Nº">${status.count}</td>
			<td data-cell="Origen">${data.origen}</td>
			<td data-cell="#{msg['lbl.fecha.salida']}">${i18n.isoDate(data.dt1)}</td>
			<td data-cell="#{msg['lbl.hora.salida']}">${i18n.isoTimeShort(data.dt1)}</td>
			<td data-cell="Destino">${data.destino}${data.spanFlag}</td>
			<td data-cell="#{msg['lbl.fecha.llegada']}">${i18n.isoDate(data.dt2)}</td>
			<td data-cell="#{msg['lbl.hora.llegada']}">${i18n.isoTimeShort(data.dt2)}</td>
			<td data-cell="#{msg['lbl.medio.trans']}">${i18n.getItem("tiposDesp", data.desp)}</td>
			<td data-cell="Asociar Etapa"><input type="checkbox" value="${data.id}" class="link-ruta" /></td>
		</tr>`;
	}

	this.tfoot = resume => {
		return `<tr><td colspan="99">Etapas: ${resume.size}</td></tr>`;
	}

	this.getTable = () => ({ msgEmptyTable: "msgRutasEmpty", beforeRender: self.beforeRender, rowCalc: self.rowCalc, onRender: self.row, onFooter: self.tfoot });
}

export default new RutaGasto();
