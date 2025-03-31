
import sb from "../../components/types/StringBox.js";
import i18n from "../../i18n/langs.js";
import firma from "../../xeco/model/Firma.js";
import solicitud from "../../xeco/model/Solicitud.js";
import perfiles from "../data/perfiles/perfiles.js"; 

function Iris() {
	const self = this; //self instance

	this.getData = solicitud.getData;
	this.isUxxiec = solicitud.isUxxiec;
	this.isEditable = solicitud.isEditable;
	this.isResumable = () => (solicitud.isPendiente() || solicitud.isFirmada() || solicitud.isIntegrada());

	this.setPerfil = (rol, colectivo, actividad, tramit, financiacion) => {
		solicitud.set("rol", rol).set("colectivo", colectivo).set("actividad", actividad);
		solicitud.set("tramite", tramit).set("financiacion", financiacion);
		solicitud.set("titulo", self.getTitulo());
		return self;
	}
	this.update = solicitud.update = data => { // update parent
		data.codigo = data.id ? data.cod : null; // synonym
		const parts = sb.split(data.cod, "/"); // ej: 2025/5697/P/PDI-FU/COM/AyL/A83
		return self.setPerfil(parts[2], parts[3], parts[4], parts[5], parts[6]); 
	}

	this.getRol = () => solicitud.get("rol");
	this.getColectivo = () => solicitud.get("colectivo");
	this.getActividad = () => solicitud.get("actividad");
	this.getTramite = () => solicitud.get("tramite");
	this.getFinanciacion = () => solicitud.get("financiacion");
	this.getTitulo = () => perfiles.getTitulo(self.getRol(), self.getColectivo(), self.getActividad(), self.getTramite(), self.getFinanciacion());

	this.isMun = () => (self.getActividad() == "MUN");
	this.hasMultipartida = () => (solicitud.mask & 1);

	this.row = data => {
		let acciones = solicitud.rowActions(data);
		if (!solicitud.isEditable())
			acciones += '<a href="#rcReport" class="row-action"><i class="fal fa-file-pdf action resize text-red"></i></a>';
		const info = solicitud.isUrgente() ? `<td class="text-center text-red text-xl" title="${data.name}: ${data.extra}">&#33;</td>` : "";
		const otras = self.hasMultipartida() ? "<span> (y otras)</span>" : "";
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
	this.tfoot = resume => `<tr><td colspan="99">Solicitudes: ${resume.size}</td></tr>`;
	solicitud.row = this.row;
	solicitud.tfoot = this.tfoot;
}

export default new Iris();
