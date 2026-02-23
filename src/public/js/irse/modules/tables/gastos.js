
import Table from "../../../components/Table.js";
import api from "../../../components/Api.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js";
import gasto from "../../model/Gasto.js";
import gastos from "../../model/Gastos.js";
import form from "../irse.js"

// tabla de gastos del paso 5 (facturas, tickets y demás documentación para liquidar)
export default class Gastos extends Table {
	constructor(form) {
		super(form.querySelector("#gastos"));
	}

	init() {
		form.set("is-zip-doc", () => (irse.isDisabled() && this.getProp("otraDoc")))
			.set("is-zip-com", () => (irse.isDisabled() && this.getProp("docComisionado")));
		this.set("#adjunto", gasto => api.init().blob("/uae/iris/download?id=" + gasto.cod, gasto.nombre)); // uuid file and name
		this.setRemove(gasto => { // remove handler
			const url = "/uae/iris/gasto/remove?id=" + gasto.id;
			return api.init().json(url).then(() => form.getPaso5().unlink(gasto));
		});
	}

	getNumDocComisionado = () => this.getProp("docComisionado");
	getNumOtraDoc = () => this.getProp("otraDoc");

	beforeRender = resume => {
		resume.noches = resume.numTransportes = resume.numPernoctas = 0;
		resume.adjuntos = resume.docComisionado = resume.otraDoc = 0;
	}

	rowCalc = (data, resume) => {
		resume.noches += gasto.isPernocta(data) ? data.num : 0;
		resume.numTransportes += gasto.isTransporte(data);
		resume.numPernoctas += gasto.isPernocta(data);
		resume.adjuntos += globalThis.isset(data.fref);
		resume.docComisionado += gasto.isDocComisionado(data);
		resume.otraDoc += gasto.isOtraDoc(data);
	}

	row(data, resume) {
		const link = `<a href="#adjunto" target="_blank" class="far fa-paperclip action resize" title="Ver adjunto"></a>`;
		const remove = irse.isEditable() ? `<a href="#remove"><i class="fas fa-times action text-red resize"></i></a>` : "";
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº">${resume.count}</td>
			<td data-cell="${i18n.get("lblTipoGasto")}">${gasto.getDescSubtipo(data)}</td>
			<td data-cell="${i18n.get("lblDescObserv")}">${gasto.getDescGasto(data)}</td>
			<td data-cell="${i18n.get("lblAdjunto")}">${data.nombre}</td>
			<td data-cell="${i18n.get("lblImporte")}">${i18n.isoFloat(data.imp1) ?? "-"} €</td>
			<td data-cell="${i18n.get("lblAcciones")}" class="no-print"><span>${link}${remove}</span></td>
		</tr>`;
	}

	render() {
		super.render(gastos.getGastos());
	}
}
