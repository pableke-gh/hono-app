
import TableHTML from "../../../components/TableHTML.js";
import api from "../../../components/Api.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js";
import gasto from "../../model/Gasto.js";
import gastos from "../../model/Gastos.js";

import observer from "../../../core/util/Observer.js";
import form from "../irse.js"

// tabla de gastos del paso 5 (facturas, tickets y demás documentación para liquidar)
export default class TableGastos extends TableHTML {
	init() {
		observer.subscribe("link", this.link).subscribe("unlink", this.unlink);
		form.set("is-zip-doc", () => (irse.isDisabled() && this.getProp("otraDoc")))
			.set("is-zip-com", () => (irse.isDisabled() && this.getProp("docComisionado")));
		this.set("#adjunto", gasto => api.init().blob("/uae/iris/download?id=" + gasto.cod, gasto.nombre)); // uuid file and name
		observer.subscribe("close", () => this.view(gastos.getGastos()));
	}

	getNumDocComisionado = () => this.getProp("docComisionado");
	getNumOtraDoc = () => this.getProp("otraDoc");

	link = data => { gastos.push(data); this.render(); } // añado un nuevo gasto
	unlink = data => { gastos.removeById(data.id); } // elimina el gasto del array

	beforeRender = resume => {
		resume.noches = resume.numTransportes = resume.numPernoctas = resume.docComisionado = resume.otraDoc = 0;
	}
	beforeRow = (data, resume) => {
		resume.noches += gasto.isPernocta(data) ? data.num : 0;
		resume.numTransportes += gasto.isTransporte(data);
		resume.numPernoctas += gasto.isPernocta(data);
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
	flush() { // remove handler
		const gasto = this.getCurrent();
		const url = "/uae/iris/gasto/remove?id=" + gasto.id;
		api.init().json(url).then(() => { super.flush(); observer.emit("unlink", gasto); });
	}
}
