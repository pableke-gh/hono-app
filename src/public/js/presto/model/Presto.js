
import i18n from "../i18n/langs.js";
import firma from "../../xeco/model/Firma.js";
import presto from "../../xeco/model/Solicitud.js";
import partidas from "./Partidas.js";

presto.getUrl = () => "/uae/presto";
presto.getPartidas = () => partidas;
presto.getPartida = partidas.getPartida;

presto.getTitulo = () => i18n.getItem("descTipos", presto.getTipo());
presto.isTcr = () => (presto.getTipo() == 1);
presto.isFce = () => (presto.getTipo() == 6);
presto.isL83 = () => (presto.getTipo() == 3);
presto.isGcr = () => (presto.getTipo() == 4);
presto.isAnt = () => (presto.getTipo() == 5);
presto.isAfc = () => (presto.getTipo() == 8);
presto.is030 = () => (presto.isUae() && (presto.isGcr() || presto.isAnt()));

//presto.isEjecutable = () => ((presto.isUae() && presto.isPendiente()) || presto.isEjecutable());
const superIsIntegrable = presto.isIntegrable; // save parent method
presto.isIntegrable = () => (!presto.isAfc() && superIsIntegrable());
presto.isImpCd = () => (presto.isEditable() && !presto.isAnt());
presto.getAdjunto = () => presto.get("file");

presto.isPartidaDec = () => (presto.isTcr() || presto.isL83() || presto.isAnt() || presto.isAfc());
presto.isTipoMultipartida = () => (presto.isTcr() || presto.isFce() || presto.isGcr());
presto.showPartidasInc = () => (presto.isTipoMultipartida() && presto.isEditable() && (partidas.size() < 20));
presto.isPartidaExt = () => (presto.isGcr() || presto.isAnt());
presto.isDisableEjInc = () => (presto.isDisabled() || presto.isTcr() /*|| presto.isFce()*/);
presto.isAutoLoadImp = () => (presto.isL83() || presto.isAnt() || presto.isAfc());
presto.isAutoLoadInc = () => (presto.isL83() || presto.isAnt());
presto.isTransferencia = () => (presto.isTcr() || presto.isL83() || presto.isFce());
presto.isGeneracion = () => (presto.isGcr() || presto.isAnt());
presto.isAnticipada = () => (presto.getMask() & 4);
presto.isExcedida = () => (presto.getMask() & 8);

presto.row = data => {
	let acciones = presto.rowActions(data);
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
		<td class="${presto.getStyleByEstado()} hide-xs table-refresh" data-refresh="text-render" data-template="@getDescEstado;">${presto.getDescEstado()}</td>
		<td class="text-center hide-xs">${firma.myFlag(data)}</td>
		<td class="hide-sm">${data.sig || ""}</td>
		<td title="${data.oIncDesc}">${data.orgInc}${otras}</td>
		<td class="text-center hide-xs" title="${data.eIncDesc}">${data.ecoInc}</td>
		<td class="text-right">${i18n.isoFloat(data.imp)} €</td>
		<td class="text-center hide-xs">${i18n.isoDate(data.fCreacion)}</td>
		<td class="hide-sm">${data.name}</td>
		<td class="hide-md">${data.memo}</td>
		<td class="text-right no-print">${acciones}</td>
	</tr>`;
}

presto.validate = data => {
	const valid = i18n.getValidators();
	if (presto.isPartidaDec()) { // valido la partida a disminuir
		valid.isKey("acOrgDec", data.idOrgDec, "Debe seleccionar la orgánica que disminuye"); // autocomplete required key
		valid.isKey("idEcoDec", data.idEcoDec, "Debe seleccionar la económica que disminuye"); // select required number
	}

	const imp = data.imp ?? 0; // los importes pueden ser nulos segun el tipo de presto
	const notValidateCd = presto.isAnt() || presto.isSubsanable(); // anticipos / subsanaciones no validan el CD
	const cd = notValidateCd ? imp : (data.cd ?? 0); // validación del crédito disponible
	if (imp > cd)
		valid.addError("imp", "errExceeded", "El importe de la partida que disminuye supera el crédito disponible");
	if (presto.isPartidaDec() && (partidas.getImporte() != imp)) // Valido los importes a decrementar e incrementar
		valid.addError("imp", "notValid", "¡Los importes a decrementar e incrementar no coinciden!");
	valid.size("memo", data.memo, "Debe asociar una memoria justificativa a la presto."); // Required string
	if (data.urgente == "2") { // Solicitud urgente
		valid.size("extra", data.extra, "Debe indicar un motivo para la urgencia de esta presto."); // Required string
		valid.geToday("fMax", data.fMax, "Debe indicar una fecha maxima de resolución para esta presto."); // Required date
	}
	return valid.isOk() && partidas.validate();
}

export default presto;
