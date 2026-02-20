
import Table from "../../../components/Table.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js";
import gasto from "../../model/Gasto.js";
import form from "../irse.js"

// tabla de gastos del paso 5 (facturas, tickets y demás documentación para liquidar)
export default class Gastos extends Table {
	constructor(form) {
		super(form.querySelector("#gastos"));
	}

	init() {
		form.set("is-zip-doc", () => (irse.isDisabled() && resume.otraDoc))
			.set("is-zip-com", () => (irse.isDisabled() && resume.docComisionado));
	}

	getNumDocComisionado = () => this.getProp("docComisionado");
	getNumOtraDoc = () => this.getProp("otraDoc");

	beforeRender = resume => {
		resume.noches = resume.numTransportes = resume.numPernoctas = 0;
		resume.adjuntos = resume.docComisionado = resume.otraDoc = 0;
	}

	rowCalc = (data, resume) => {
		resume.noches += this.isPernocta(data) ? data.num : 0;
		resume.numTransportes += this.isTransporte(data);
		resume.numPernoctas += this.isPernocta(data);
		resume.adjuntos += globalThis.isset(data.fref);
		resume.docComisionado += this.isDocComisionado(data);
		resume.otraDoc += this.isOtraDoc(data);
	}

	getDescSubtipo = data => {
		if (gasto.isFactura(data))
			return i18n.get("lblFactTransporte");
		if (gasto.isTicket(data))
			return i18n.getItem("tipoTickets", data.subtipo) || "-";
		if (gasto.isPernocta(data))
			return i18n.get("lblFactAlojamiento");
		if (gasto.isExtra(data))
			return i18n.getItem("tipoExtra", data.subtipo) || "-";
		return gasto.isDoc(data) ? i18n.getItem("tipoDocs", data.subtipo) : data.desc;
	}
	getDescSubtipoImp = data => {
		return gasto.getDescSubtipo(data) + ": " + i18n.isoFloat(data.imp1) + " €";
	}
	getDescGasto = data => {
		if (gasto.isFactura(data))
			return i18n.render(i18n.get("lblFactRutas"), data);
		if (gasto.isTaxiJustifi(data)) // descripcion del itinerario del taxi
			return data.desc;
		if (gasto.isTicket(data))
			return i18n.getItem("tipoTickets", data.subtipo) || "-";
		return gasto.isPernocta(data) ? i18n.render(i18n.get("lblRangoNoches"), data) : data.desc;
	}

	row(data, resume) {
		const link = `<a href="#adjunto" target="_blank" class="far fa-paperclip action resize" title="Ver adjunto"></a>`;
		const remove = iris.isEditable() ? `<a href="#remove"><i class="fas fa-times action text-red resize"></i></a>` : "";
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº">${resume.count}</td>
			<td data-cell="${i18n.get("lblTipoGasto")}">${this.getDescSubtipo(data)}</td>
			<td data-cell="${i18n.get("lblDescObserv")}">${this.getDescGasto(data)}</td>
			<td data-cell="${i18n.get("lblAdjunto")}">${data.nombre}</td>
			<td data-cell="${i18n.get("lblImporte")}">${i18n.isoFloat(data.imp1) ?? "-"} €</td>
			<td data-cell="${i18n.get("lblAcciones")}" class="no-print"><span>${link}${remove}</span></td>
		</tr>`;
	}
}
