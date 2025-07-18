
import sb from "../../components/types/StringBox.js";
import i18n from "../i18n/langs.js";
import firma from "../../xeco/model/Firma.js";
import solicitud from "../../xeco/model/Solicitud.js";
import perfiles from "../data/perfiles/perfiles.js"; 

solicitud.isActivablePaso8 = () => (solicitud.isUae() && solicitud.isEditable()); // pueden mostrarse los campos del paso 8
solicitud.isReactivable = () => (solicitud.isUae() && (solicitud.isInvalidada() || solicitud.isErronea())); // La solicitud se puede reactivar / subsanar
solicitud.isResumable = () => (solicitud.isPendiente() || solicitud.isFirmada() || solicitud.isIntegrada()); // muestra el boton de resumen (paso 6)

solicitud.setPerfil = (rol, colectivo, actividad, tramit, financiacion) => {
	solicitud.set("rol", rol).set("colectivo", colectivo).set("actividad", actividad);
	solicitud.set("tramite", tramit).set("financiacion", financiacion);
	solicitud.set("titulo", solicitud.getTitulo());
	return solicitud;
}
solicitud.init = data => { // update parent
	data.codigo = data.id ? data.cod : null; // synonym
	const parts = sb.split(data.cod, "/"); // ej: 2025/5697/P/PDI-FU/COM/AyL/A83
	return solicitud.setPerfil(parts[2], parts[3], parts[4], parts[5], parts[6]); 
}

solicitud.getRol = () => solicitud.get("rol");
solicitud.getColectivo = () => solicitud.get("colectivo");
solicitud.getActividad = () => solicitud.get("actividad");
solicitud.getTramite = () => solicitud.get("tramite");
solicitud.getFinanciacion = () => solicitud.get("financiacion");
solicitud.getTitulo = () => perfiles.getTitulo(solicitud.getRol(), solicitud.getColectivo(), solicitud.getActividad(), solicitud.getTramite(), solicitud.getFinanciacion());

solicitud.getNifInteresado = () => solicitud.get("nifInt");
solicitud.getInteresado = () => solicitud.get("interesado");
solicitud.getEmailInteresado = () => solicitud.get("emailInt");

solicitud.isMun = () => (solicitud.getActividad() == "MUN");
solicitud.isConflicto = () => (solicitud.getMask() & 2); //existen solicitudes previas a nombre del interesado coincidentes en fechas?
solicitud.isPaso8 = () => (solicitud.getMask() & 4); // paso 8 activado manualmente por la uae
solicitud.isMaxVigencia = () => (solicitud.getMask() & 8); //maxima fecha de vigencia en rrhh

solicitud.row = data => {
	let acciones = solicitud.rowActions(data);
	if (solicitud.isDocumentable()) {
		if (solicitud.isAdmin()) {
			acciones += '<a href="#rcFinalizar" class="row-action" title="Consulta los datos de la solicitud"><i class="fas fa-clipboard-list action text-blue resize"></i></a>'; 
			//acciones += '<a href="#pdf" class="row-action" title="Informe IRIS"><i class="fas fa-file-pdf action text-red resize"></i></a>';
		}
		acciones += '<a href="#report" class="row-action" title="Informe IRIS"><i class="fal fa-file-pdf action text-red resize"></i></a>';
		data.report = "/uae/iris/report?id=" + data.id;
	}
	if (solicitud.isReactivable())
		acciones += '<a href="#rcReactivar" class="row-action" title="Subsanar la comunicación"><i class="far fa-edit action text-blue resize"></i></a>';
	if (solicitud.isActivablePaso8())
		acciones += '<a href="#rcPaso8" class="row-action" title="Activar Otras Indemnizaciones Extraordinarias (paso 8)"><i class="fas fa-plus action text-green resize"></i></a>';

	const info = solicitud.isUrgente() ? `<td class="text-center text-red text-xl" title="${data.name}: ${data.extra}">&#33;</td>` : "<td></td>";
	const otras = solicitud.isMultilinea() ? "<span> (y otras)</span>" : "";
	return `<tr class="tb-data">
		${info}
		<td class="text-center"><a href="#rcView" class="row-action" title="${data.cod}: ${data.name}">${sb.substr(data.cod, 0, 9)}</a></td>
		<td class="${solicitud.getStyleByEstado()} estado">${solicitud.getDescEstado()}</td>
		<td class="text-center">${firma.myFlag(data)}</td>
		<td class="hide-sm">${data.sig || ""}</td>
		<td class="text-center hide-xs">${i18n.isoDate(data.fCreacion)}</td>
		<td class="hide-sm">${data.org}<span class="hide-sm"> ${data.oDesc}</span>${otras}</td> 
		<td class="hide-sm">${data.name}</td>
		<td class="hide-md">${data.memo || ""}</td>
		<td class="text-right">${i18n.isoFloat(data.imp) || "-"} €</td>
		<td class="text-right no-print">${acciones}</td>
	</tr>`;
}

export default solicitud;
