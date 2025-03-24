
import i18n from "../../i18n/langs.js";
import solicitud from "../../xeco/model/Solicitud.js";
import firma from "../../xeco/model/Firma.js";
import partidas from "./Partidas.js";

function Presto() {
	const self = this; //self instance

	this.getData = solicitud.getData;
	this.isUxxiec = solicitud.isUxxiec;
	this.isUae = solicitud.isUae;
	this.isEditable = solicitud.isEditable;
	this.isDisabled = solicitud.isDisabled;
	this.isEditableUae = solicitud.isEditableUae;
	this.isFinalizada = solicitud.isFinalizada;
	this.getCodigo = solicitud.getCodigo;
	this.getTitulo = tipo => i18n.getItem("descTipos", tipo - 1);
	this.getMemoria = solicitud.getMemoria;
	this.isUrgente = solicitud.isUrgente;
	//this.setUrgente = solicitud.setUrgente;

	this.getPartidas = () => partidas;
    this.getPartida = partidas.getPartida;

	this.isTcr = () => (solicitud.getTipo() == 1);
	this.isFce = () => (solicitud.getTipo() == 6);
	this.isL83 = () => (solicitud.getTipo() == 3);
	this.isGcr = () => (solicitud.getTipo() == 4);
	this.isAnt = () => (solicitud.getTipo() == 5);
	this.isAfc = () => (solicitud.getTipo() == 8);
	this.is030 = () => (solicitud.isUae() && (self.isGcr() || self.isAnt()));

	//this.isEjecutable = () => ((solicitud.isUae() && solicitud.isPendiente()) || solicitud.isEjecutable());
	this.isIntegrable = () => (!self.isAfc() && solicitud.isIntegrable());
	this.isImpCd = () => (solicitud.isEditable() && !self.isAnt());
	this.getAdjunto = () => solicitud.get("file");

    this.isPartidaDec = () => (self.isTcr() || self.isL83() || self.isAnt() || self.isAfc());
	this.isMultipartida = () => (self.isTcr() || self.isFce() || self.isGcr());
	this.showPartidasInc = () => (self.isMultipartida() && solicitud.isEditable() && (partidas.size() < 20));
	this.isPartidaExt = () => (self.isGcr() || self.isAnt());
	this.isDisableEjInc = () => (solicitud.isDisabled() || self.isTcr() /*|| self.isFce()*/);
	this.isAutoLoadImp = () => (self.isL83() || self.isAnt() || self.isAfc());
	this.isAutoLoadInc = () => (self.isL83() || self.isAnt());
	this.hasMultipartida = () => (solicitud.mask & 1);
	this.isAnticipada = () => (solicitud.mask & 4);
	this.isExcedida = () => (solicitud.mask & 8);

	this.row = data => {
		let acciones = solicitud.rowActions(data);
		if (!solicitud.isEditable())
			acciones += '<a href="#rcReport" class="row-action"><i class="fal fa-file-pdf action resize text-red"></i></a>';

		let info = '<td></td>';
		if (solicitud.isUrgente())
			info = `<td class="text-center text-red text-xl" title="${data.name}: ${data.extra}">&#33;</td>`;
		if ((solicitud.isUae() || solicitud.isOtri()) && self.isAnticipada())
			info = '<td class="text-center text-xl" title="Este contrato ha gozado de anticipo en algún momento">&#65;</td>';
		if ((solicitud.isUae() || solicitud.isOtri()) && self.isExcedida())
			info = '<td class="text-center text-warn text-xl" title="La cantidad solicitada excede el margen registrado por el Buzón de Ingresos">&#9888;</td>';

		const titulo = self.getTitulo(data.tipo);
		const otras = self.hasMultipartida() ? "<span> (y otras)</span>" : "";
		return `<tr class="tb-data">
			${info}
			<td class="text-center"><a href="#rcView" class="row-action">${data.codigo}</a></td>
			<td class="hide-sm">${titulo}</td>
			<td class="${solicitud.getStyleByEstado()} estado-${data.id}">${solicitud.getDescEstado()}</td>
			<td class="text-center">${firma.myFlag(data)}</td>
			<td class="hide-sm">${data.sig || ""}</td>
			<td title="${data.oIncDesc}">${data.orgInc}${otras}</td>
			<td class="text-center" title="${data.eIncDesc}">${data.ecoInc}</td>
			<td class="text-right">${i18n.isoFloat(data.imp)} €</td>
			<td class="text-center hide-xs">${i18n.isoDate(data.fCreacion)}</td>
			<td class="hide-sm">${data.name}</td>
			<td class="hide-md">${data.memo}</td>
			<td class="text-right no-print">${acciones}</td>
		</tr>`;
	}
	this.tfoot = resume => `<tr><td colspan="99">Solicitudes: ${resume.size}</td></tr>`;
	solicitud.row = this.row;
	solicitud.tfoot = this.tfoot;

	this.validate = data => {
		const valid = i18n.getValidators();
		valid.isKey("acOrgDec", data.idOrgDec, "Debe seleccionar la orgánica que disminuye"); // autocomplete required key
		valid.isKey("idEcoDec", data.idEcoDec, "Debe seleccionar la económica que disminuye"); // select required number

		const imp = data.impDec ?? 0; // los importes pueden ser nulos segun el tipo de presto
		const cd = self.isAnt() ? imp : (data.cd ?? 0); // los anticipos no validan el CD
		if (imp > cd)
			valid.addError("impDec", "errExceeded", "El importe de la partida que disminuye supera el crédito disponible");
		if (self.isPartidaDec() && (partidas.getImporte() != imp)) // Valido los importes a decrementar e incrementar
			valid.addError("impDec", "notValid", "¡Los importes a decrementar e incrementar no coinciden!");
		valid.size("memo", data.memo, "Debe asociar una memoria justificativa a la solicitud."); // Required string
		if (data.urgente == "2") { // Solicitud urgente
			valid.size("extra", data.extra, "Debe indicar un motivo para la urgencia de esta solicitud."); // Required string
			valid.geToday("fMax", data.fMax, "Debe indicar una fecha maxima de resolución para esta solicitud."); // Required date
		}
		return valid.isOk() && partidas.validate();
	}
}

export default new Presto();
