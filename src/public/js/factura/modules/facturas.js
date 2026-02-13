
import i18n from "../i18n/langs.js";
import factura from "../model/Factura.js";
import firma from "../../core/model/Firma.js";
import Solicitudes from "../../core/modules/solicitudes.js";

class Facturas extends Solicitudes {
	constructor() { super(factura); }

	row(data) {
		let acciones = super.row(data);
		return `<tr class="tb-data">
			<td class="text-center"><a href="#view">${data.codigo}</a></td>
			<td class="hide-sm text-upper1">${factura.getTitulo()}</td>
			<td class="${factura.getStyleByEstado()} hide-xs table-refresh" data-refresh="update-estado">${factura.getDescEstado()}</td>
			<td class="text-center hide-xs">${firma.myFlag(data)}</td>
			<td class="hide-sm">${data.sig || ""}</td>
			<td class="text-center hide-xs">${i18n.isoDate(data.fCreacion)}</td>
			<td class="currency">${i18n.isoFloat(data.imp)} €</td>
			<td>${data.nif}</td><td class="hide-xs">${data.tercero}</td>
			<td>${data.org}</td><td class="hide-sm">${data.descOrg}</td>
			<td class="hide-sm">${data.name}</td>
			<td class="currency no-print">${acciones}</td>
		</tr>`;
	}
}

export default new Facturas();
