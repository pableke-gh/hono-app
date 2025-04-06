
import sb from "../../components/types/StringBox.js";
import i18n from "../../i18n/langs.js";
import firma from "../../xeco/model/Firma.js";
import solicitud from "../../xeco/model/Solicitud.js";
import perfiles from "../data/perfiles/perfiles.js"; 

solicitud.isResumable = () => (solicitud.isPendiente() || solicitud.isFirmada() || solicitud.isIntegrada());

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

solicitud.isMun = () => (solicitud.getActividad() == "MUN");
solicitud.hasMultipartida = () => (solicitud.mask & 1);

solicitud.row = data => {
	let acciones = solicitud.rowActions(data);
	if (!solicitud.isEditable())
		acciones += '<a href="#rcReport" class="row-action"><i class="fal fa-file-pdf action resize text-red"></i></a>';
	const info = solicitud.isUrgente() ? `<td class="text-center text-red text-xl" title="${data.name}: ${data.extra}">&#33;</td>` : "";
	const otras = solicitud.hasMultipartida() ? "<span> (y otras)</span>" : "";
	return `<tr class="tb-data">
		<td>${info}</td>
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
