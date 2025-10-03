
import i18n from "../../i18n/langs.js";
import iris from "../Iris.js";
import ruta from "./Ruta.js";

function RutaMaps() {
	const self = this; //self instance

	this.isPrincipal = ruta.isPrincipal;
	this.beforeRender = ruta.beforeRender;
	this.rowCalc = ruta.rowCalc;

	this.row = (data, status, resume) => {
		self.rowCalc(data, resume);
		const destino = iris.isEditable() ? `<a href="#main">${data.destino}${data.tplFlag}</a>` : `${data.destino}${data.tplFlag}`;
		const remove = iris.isEditable() ? '<a href="#flush"><i class="fas fa-times action text-red resize"></i></a>' : ""; // #{iris.form.editableP0}
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº" class="hide-sm">${status.count}</td>
			<td data-cell="${i18n.get("lblOrigen")}">${data.origen}</td>
			<td data-cell="${i18n.get("lblFechaSalida")}">${i18n.isoDate(data.dt1)}</td>
			<td data-cell="${i18n.get("lblHoraSalida")}">${i18n.isoTimeShort(data.dt1)}</td>
			<td data-cell="${i18n.get("lblDestino")}">${destino}</td>
			<td data-cell="${i18n.get("lblFechaLlegada")}">${i18n.isoDate(data.dt2)}</td>
			<td data-cell="${i18n.get("lblHoraLlegada")}">${i18n.isoTimeShort(data.dt2)}</td>
			<td data-cell="${i18n.get("lblTransporte")}">${i18n.getItem("tiposDesp", data.desp)}</td>
			<td data-cell="Km." class="hide-sm">${i18n.isoFloat(data.km2) || "-"}</td>
			<td data-cell="${i18n.get("lblAcciones")}" class="no-print">${remove}</td>
		</tr>`;
	}

	this.tfoot = resume => {
		resume.getTotKmCalc = () => ((resume.totKmCalc > 0) ? i18n.isoFloat(resume.totKmCalc) : "-");
		return `<tr>
			<td class="table-refresh" colspan="8" data-refresh="text-render" data-template="@lblEtapas;: @size;">${i18n.get("lblEtapas")}: ${resume.size}</td>
			<td class="tb-data-tc hide-xs hide-sm table-refresh" data-refresh="text-render" data-template="@getTotKmCalc;">${resume.getTotKmCalc()}</td>
			<td class="hide-sm no-print"></td>
		</tr>`;
	}

	this.afterRender = resume => {
		resume.impKm = resume.totKm * ruta.getImpGasolina();
	}

	this.getTable = () => ({ msgEmptyTable: "msgRutasEmpty", beforeRender: self.beforeRender, rowCalc: self.rowCalc, onRender: self.row, onFooter: self.tfoot });
}

export default new RutaMaps();
