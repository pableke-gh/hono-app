
import i18n from "../i18n/langs.js";
import firma from "../../xeco/model/Firma.js";
import solicitud from "../../xeco/model/Solicitud.js";
import partidas from "./Partidas.js";

solicitud.getUrl = () => "/uae/presto";
solicitud.getPartidas = () => partidas;
solicitud.getPartida = partidas.getPartida;

solicitud.getTitulo = () => i18n.getItem("descTipos", solicitud.getTipo());
solicitud.isTcr = () => (solicitud.getTipo() == 1);
solicitud.isFce = () => (solicitud.getTipo() == 6);
solicitud.isL83 = () => (solicitud.getTipo() == 3);
solicitud.isGcr = () => (solicitud.getTipo() == 4);
solicitud.isAnt = () => (solicitud.getTipo() == 5);
solicitud.isAfc = () => (solicitud.getTipo() == 8);
solicitud.is030 = () => (solicitud.isUae() && (solicitud.isGcr() || solicitud.isAnt()));

//solicitud.isEjecutable = () => ((solicitud.isUae() && solicitud.isPendiente()) || solicitud.isEjecutable());
const superIsIntegrable = solicitud.isIntegrable; // save parent method
solicitud.isIntegrable = () => (!solicitud.isAfc() && superIsIntegrable());
solicitud.isImpCd = () => (solicitud.isEditable() && !solicitud.isAnt());
solicitud.getAdjunto = () => solicitud.get("file");

solicitud.isPartidaDec = () => (solicitud.isTcr() || solicitud.isL83() || solicitud.isAnt() || solicitud.isAfc());
solicitud.isTipoMultipartida = () => (solicitud.isTcr() || solicitud.isFce() || solicitud.isGcr());
solicitud.showPartidasInc = () => (solicitud.isTipoMultipartida() && solicitud.isEditable() && (partidas.size() < 20));
solicitud.isPartidaExt = () => (solicitud.isGcr() || solicitud.isAnt());
solicitud.isDisableEjInc = () => (solicitud.isDisabled() || solicitud.isTcr() /*|| solicitud.isFce()*/);
solicitud.isAutoLoadImp = () => (solicitud.isL83() || solicitud.isAnt() || solicitud.isAfc());
solicitud.isAutoLoadInc = () => (solicitud.isL83() || solicitud.isAnt());
solicitud.isTransferencia = () => (solicitud.isTcr() || solicitud.isL83() || solicitud.isFce());
solicitud.isGeneracion = () => (solicitud.isGcr() || solicitud.isAnt());
solicitud.isAnticipada = () => (solicitud.getMask() & 4);
solicitud.isExcedida = () => (solicitud.getMask() & 8);

solicitud.row = data => {
	let acciones = solicitud.rowActions(data);
	if (solicitud.isDocumentable()) {
		//acciones += solicitud.isAdmin() ? '<a href="#pdf" class="row-action" title="Informe PRESTO"><i class="fas fa-file-pdf action resize text-red"></i></a>' : "";
		acciones += '<a href="#report" class="row-action" title="Informe PRESTO"><i class="fal fa-file-pdf action resize text-red"></i></a>';
	}

	let info = '<td></td>';
	if (solicitud.isUrgente())
		info = `<td class="text-center text-red text-xl" title="${data.name}: ${data.extra}">&#33;</td>`;
	if ((solicitud.isUae() || solicitud.isOtri()) && solicitud.isAnticipada())
		info = '<td class="text-center text-xl" title="Este contrato ha gozado de anticipo en algún momento">&#65;</td>';
	if ((solicitud.isUae() || solicitud.isOtri()) && solicitud.isExcedida())
		info = '<td class="text-center text-warn text-xl" title="La cantidad solicitada excede el margen registrado por el Buzón de Ingresos">&#9888;</td>';

	const otras = solicitud.isMultilinea() ? "<span> (y otras)</span>" : "";
	return `<tr class="tb-data">
		${info}
		<td class="text-center"><a href="#view" class="row-action">${data.codigo}</a></td>
		<td class="hide-sm">${solicitud.getTitulo()}</td>
		<td class="${solicitud.getStyleByEstado()} table-refresh" data-refresh="text-render" data-template="@getDescEstado;">${solicitud.getDescEstado()}</td>
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

solicitud.validate = data => {
	const valid = i18n.getValidators();
	if (solicitud.isPartidaDec()) { // valido la partida a disminuir
		valid.isKey("acOrgDec", data.idOrgDec, "Debe seleccionar la orgánica que disminuye"); // autocomplete required key
		valid.isKey("idEcoDec", data.idEcoDec, "Debe seleccionar la económica que disminuye"); // select required number
	}

	const imp = data.imp ?? 0; // los importes pueden ser nulos segun el tipo de presto
	const notValidateCd = solicitud.isAnt() || solicitud.isSubsanable(); // anticipos / subsanaciones no validan el CD
	const cd = notValidateCd ? imp : (data.cd ?? 0); // validación del crédito disponible
	if (imp > cd)
		valid.addError("imp", "errExceeded", "El importe de la partida que disminuye supera el crédito disponible");
	if (solicitud.isPartidaDec() && (partidas.getImporte() != imp)) // Valido los importes a decrementar e incrementar
		valid.addError("imp", "notValid", "¡Los importes a decrementar e incrementar no coinciden!");
	valid.size("memo", data.memo, "Debe asociar una memoria justificativa a la solicitud."); // Required string
	if (data.urgente == "2") { // Solicitud urgente
		valid.size("extra", data.extra, "Debe indicar un motivo para la urgencia de esta solicitud."); // Required string
		valid.geToday("fMax", data.fMax, "Debe indicar una fecha maxima de resolución para esta solicitud."); // Required date
	}
	return valid.isOk() && partidas.validate();
}

export default solicitud;
