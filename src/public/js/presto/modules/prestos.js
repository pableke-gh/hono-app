
import i18n from "../i18n/langs.js";
import presto from "../model/Presto.js";
import firma from "../../core/model/Firma.js";
import Solicitudes from "../../core/modules/solicitudes.js";

class Prestos extends Solicitudes {
	constructor() { super(presto); }

	row(data) {
		let acciones = super.row(data);
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

export default new Prestos();
