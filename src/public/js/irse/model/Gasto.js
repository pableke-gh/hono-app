
import i18n from "../../i18n/langs.js";
import irse from "./Irse.js";

class Gasto {
	isFactura = gasto => (gasto.tipo == 1);
	isTicket = gasto => (gasto.tipo == 2);

	isTaxi = gasto => (this.isTicket(gasto) && (gasto.subtipo == 4));
	isTaxiJustifi = gasto => (this.isTaxi(gasto) && gasto.desc);
	isTipoTaxi = tipo => (tipo == "4"); //ISU y taxi

	isTransporte = gasto => (this.isFactura(gasto) || this.isTicket(gasto));
	isDieta = gasto => (gasto.tipo == 7);

	isPernocta = gasto => (gasto.tipo == 6);
	isTipoPernocta = tipo => (tipo == "9"); //Tipo pernocta

	isExtra = gasto => (gasto.tipo == 8);
	isTipoExtra = tipo => ["301", "302", "303", "304"].includes(tipo);

	isDoc = gasto => (gasto.tipo == 9);
	isTipoDoc = tipo => ["201", "202", "204", "205", "206"].includes(tipo);

	isDocJustifi = gasto => (this.isDoc(gasto) && (gasto.subtipo == 3));
	isDocComisionado = gasto => (this.isTransporte(gasto) || this.isPernocta(gasto) || this.isDocJustifi(gasto));
	isOtraDoc = gasto => (this.isDoc(gasto) && (gasto.subtipo != 3));
	isKm = gasto => (gasto.tipo == 10); // paso 1 / 2 = matricula / km
	isSubvencion = gasto => (gasto.tipo == 3); // paso 3 = isu
	isCongreso = gasto => (gasto.tipo == 4); // paso 3 = isu
	isAsistencia = gasto => (gasto.tipo == 5); // paso 4 = asistencias / colaboraciones
	isIban = gasto => (gasto.tipo == 12); // paso 9 = liquidacion
	isBanco = gasto => (gasto.tipo == 13); // paso 9 = liquidacion
	isPaso5 = gasto => this.isFactura(gasto) || this.isTicket(gasto) || this.isPernocta(gasto) || this.isExtra(gasto) || this.isDoc(gasto);
	isOrganica = gasto => (gasto.tipo == 19); // paso 9 = multiorganica
	isOrganicaDieta = gasto => (this.isOrganica(gasto) && (gasto.subtipo == 1)); // paso 9 = multiorganica dieta = 1
	isOrganicaPernocta = gasto => (this.isOrganica(gasto) && (gasto.subtipo == 2)); // paso 9 = multiorganica pernocta = 2
	isOrganicaTrans = gasto => (this.isOrganica(gasto) && (gasto.subtipo == 3)); // paso 9 = multiorganica transporte = 3
	isOrganicaAc = gasto => (this.isOrganica(gasto) && (gasto.subtipo == 4)); // paso 9 = multiorganica asistencias = 4

	// table renders
	beforeRender(resume) {
		resume.noches = resume.numTransportes = resume.numPernoctas = 0;
		resume.adjuntos = resume.docComisionado = resume.otraDoc = 0;
	}
	rowCalc(data, resume) {
		resume.noches += this.isPernocta(data) ? data.num : 0;
		resume.numTransportes += this.isTransporte(data);
		resume.numPernoctas += this.isPernocta(data);
		resume.adjuntos += globalThis.isset(data.fref);
		resume.docComisionado += this.isDocComisionado(data);
		resume.otraDoc += this.isOtraDoc(data);
	}

	getDescSubtipo = data => {
		if (this.isFactura(data))
			return i18n.get("lblFactTransporte");
		if (this.isTicket(data))
			return i18n.getItem("tipoTickets", data.subtipo) || "-";
		if (this.isPernocta(data))
			return i18n.get("lblFactAlojamiento");
		if (this.isExtra(data))
			return i18n.getItem("tipoExtra", data.subtipo) || "-";
		return this.isDoc(data) ? i18n.getItem("tipoDocs", data.subtipo) : data.desc;
	}
	getDescGasto = data => {
		if (this.isFactura(data))
			return i18n.render(i18n.get("lblFactRutas"), data);
		if (this.isTaxiJustifi(data)) // descripcion del itinerario del taxi
			return data.desc;
		if (this.isTicket(data))
			return i18n.getItem("tipoTickets", data.subtipo) || "-";
		return this.isPernocta(data) ? i18n.render(i18n.get("lblRangoNoches"), data) : data.desc;
	}

	row(data, resume) {
		const link = `<a href="#adjunto" target="_blank" class="far fa-paperclip action resize" title="Ver adjunto"></a>`;
		const remove = irse.isEditable() ? `<a href="#remove"><i class="fas fa-times action text-red resize"></i></a>` : "";
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº">${resume.count}</td>
			<td data-cell="${i18n.get("lblTipoGasto")}">${this.getDescSubtipo(data)}</td>
			<td data-cell="${i18n.get("lblDescObserv")}">${this.getDescGasto(data)}</td>
			<td data-cell="${i18n.get("lblAdjunto")}">${data.nombre}</td>
			<td data-cell="${i18n.get("lblImporte")}">${i18n.isoFloat(data.imp1) ?? "-"} €</td>
			<td data-cell="${i18n.get("lblAcciones")}" class="no-print"><span>${link}${remove}</span></td>
		</tr>`;
	}

	getTable = () => ({ msgEmptyTable: "msgGastosEmpty", beforeRender: this.beforeRender, rowCalc: this.rowCalc, onRender: this.row });
}

export default new Gasto();
