
import api from "../../core/components/Api.js";
import tabs from "../../core/components/helper/Tabs.js";
import i18n from "../i18n/langs.js";

import TableHTML from "../../core/components/Table.js";
import firma from "../../core/model/Firma.js";
import presto from "../model/Presto.js";

export default class PrestosTable extends TableHTML {
	showList = () => { this.reloadRow(); tabs.showList(); } // reload current row + show list tab
	setWorking = () => { presto.setProcesando(); this.showList(); } // update current row state

	connectedCallback() { // initialize table
		const form = document.forms["presto-form"];
		//form.setTable(this); // set table reference in form

		// table actions
		this.setMsgEmpty("No se han encontrado solicitudes para a la búsqueda seleccionada");
		this.set("#emails", data => api.init().json("/uae/pedidos/emails?id=" + data.id)); // admin test email
		this.set("#integrar", data => { // integra la solicitud seleccionada en uxxiec
			const url = "/uae/pedidos/ws?id=" + presto.setData(data).getId();
			i18n.confirm("msgIntegrar") && api.init().json(url).then(this.setWorking);
		});

		this.set("#view", form.load).set("#reject", form.reject).set("#report", this.report);
		this.set("#firmar", data => { presto.setData(data); form.firmar.execute(); });
		this.set("isFirmable", (link, data) => presto.setData(data).isFirmable())
		this.set("isIntegrable", (link, data) => presto.setData(data).isIntegrable())
		this.set("update-estado", (td, data) => { // actualizo la celda del estado
			td.innerHTML = presto.setData(data).getDescEstado(); // set texto de estado
			td.className = presto.getStyleByEstado() + " hide-xs table-reload"; // set estilos
			return true; // show td cell
		});

		// buttons action
		tabs.setAction("view", () => form.load(this.getCurrent()));
	}

	row(data) {
		let acciones = '<a href="#view"><i class="fas fa-search action resize text-blue"></i></a>';
		if (presto.setData(data).isFirmable()) { // initialize and verify state
			acciones += '<a href="#firmar" class="resize table-refresh" data-refresh="isFirmable"><i class="fas fa-check action resize text-green"></i></a>';
			acciones += '<a href="#reject" class="resize table-refresh" data-refresh="isFirmable"><i class="fas fa-times action resize text-red"></i></a>';
		}
		if (presto.isEjecutable())
			acciones += '<a href="#uxxiec"><i class="fal fa-cog action resize text-green"></i></a>';
		if (presto.isIntegrable())
			acciones += '<a href="#integrar" class="table-refresh" data-refresh="isIntegrable"><i class="far fa-save action resize text-blue"></i></a>';
		if (presto.isAdmin())
			acciones += '<a href="#emails"><i class="fal fa-mail-bulk action resize text-blue"></i></a><a href="#remove"><i class="fal fa-trash-alt action resize text-red"></i></a>';

		if (presto.isDocumentable()) {
			//acciones += presto.isAdmin() ? '<a href="#pdf" title="Informe PRESTO"><i class="fas fa-file-pdf action resize text-red"></i></a>' : "";
			acciones += '<a href="#report" title="Informe PRESTO"><i class="fal fa-file-pdf action resize text-red"></i></a>';
		}

		let info = '<td></td>';
		if (presto.isUrgente())
			info = `<td class="text-center text-red text-xl" title="${data.name}: ${data.extra}">&#33;</td>`;
		if ((presto.isUae() || presto.isOtri()) && presto.isAnticipada())
			info = '<td class="text-center text-xl" title="Este contrato ha gozado de anticipo en algún momento">&#65;</td>';
		if ((presto.isUae() || presto.isOtri()) && presto.isExcedida())
			info = '<td class="text-center text-warn text-xl" title="La cantidad solicitada excede el margen registrado por el Buzón de Ingresos">&#9888;</td>';

		const otras = presto.isMultilinea() ? "<span> (y otras)</span>" : "";
		return `<tr class="tb-data">
			${info}
			<td class="text-center"><a href="#view">${data.codigo}</a></td>
			<td class="hide-sm">${presto.getTitulo()}</td>
			<td class="${presto.getStyleByEstado()} hide-xs table-refresh" data-refresh="update-estado">${presto.getDescEstado()}</td>
			<td class="text-center hide-xs">${firma.myFlag(data)}</td>
			<td class="hide-sm">${data.sig || ""}</td>
			<td title="${data.oIncDesc}">${data.orgInc}${otras}</td>
			<td class="text-center hide-xs" title="${data.eIncDesc}">${data.ecoInc}</td>
			<td class="currency">${i18n.isoFloat(data.imp)} €</td>
			<td class="text-center hide-xs">${i18n.isoDate(data.fCreacion)}</td>
			<td class="hide-sm">${data.name}</td>
			<td class="hide-md">${data.memo}</td>
			<td class="currency no-print">${acciones}</td>
		</tr>`;
	}
}
