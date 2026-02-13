
import sb from "../../components/types/StringBox.js";
import i18n from "../i18n/langs.js";

import irse from "../model/Irse.js";
import firma from "../../core/model/Firma.js";
import Solicitudes from "../../core/modules/solicitudes.js";

class IrseSolicitudes extends Solicitudes {
	constructor() { super(irse); }

	row(data) {
		let acciones = super.row(data);
		if (irse.isDocumentable()) {
			if (irse.isAdmin()) {
				acciones += '<a href="#rptFinalizar" title="Consulta los datos de la solicitud"><i class="fas fa-clipboard-list action text-blue resize"></i></a>'; 
				//acciones += '<a href="#pdf" title="Informe IRIS"><i class="fas fa-file-pdf action text-red resize"></i></a>';
			}
			acciones += '<a href="#report" title="Informe IRIS"><i class="fal fa-file-pdf action text-red resize"></i></a>';
		}
		if (irse.isReactivable())
			acciones += '<a href="#reset" title="Subsanar la comunicación"><i class="far fa-edit action text-blue resize"></i></a>';
		if (irse.isActivablePaso8())
			acciones += '<a href="#paso8" title="Activar Otras Indemnizaciones Extraordinarias (paso 8)"><i class="fas fa-plus action text-green resize"></i></a>';

		const info = irse.isUrgente() ? `<td class="text-center text-red text-xl" title="${data.name}: ${data.extra}">&#33;</td>` : "<td></td>";
		const otras = irse.isMultilinea() ? "<span> (y otras)</span>" : "";
		return `<tr class="tb-data">
			${info}
			<td class="text-center"><a href="#view" title="${data.codigo}: ${data.name}">${sb.substr(data.codigo, 0, 9)}</a></td>
			<td class="${irse.getStyleByEstado()} table-refresh" data-refresh="text-render" data-template="@getDescEstado;">${irse.getDescEstado()}</td>
			<td class="text-center">${firma.myFlag(data)}</td>
			<td class="hide-sm">${data.sig || ""}</td>
			<td class="text-center hide-xs">${i18n.isoDate(data.fCreacion)}</td>
			<td class="hide-sm">${data.org}<span class="hide-sm"> ${data.oDesc}</span>${otras}</td> 
			<td class="hide-sm">${data.interesado}</td>
			<td class="hide-md">${data.memo || ""}</td>
			<td class="currency">${i18n.isoFloat(data.imp) || "-"} €</td>
			<td class="currency no-print">${acciones}</td>
		</tr>`;
	}
}

export default new IrseSolicitudes();
