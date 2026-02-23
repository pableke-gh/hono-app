
import Table from "../../../components/Table.js";
import i18n from "../../../i18n/langs.js";

import irse from "../../model/Irse.js";
import ruta from "../../model/Ruta.js";
import rutas from "../../model/Rutas.js";
import gasto from "../../model/Gasto.js";
import gastos from "../../model/Gastos.js";

/*********** ASOCIAR RUTAS / GASTOS ***********/
export default class RutaGasto extends Table {
	constructor(form) {
		super(form.querySelector("#rutas-out"));
	}

	init() {
		irse.getNumRutasPendientes = this.size;
	}

	getChecked = () => this.getBody().$$(":checked").map(el => +el.value);
	link(data) {
		gastos.push(data); // add new gasto
		if (!gasto.isFactura(data)) return; // no es factura
		rutas.link(this.getChecked(), data.id); // link gasto id to rutas
		this.view(); // update changes in pending routes
	}
	unlink(data) {
		gastos.removeById(data.id); // elimino el gasto del array
		rutas.unlink(data.id); // actualizo el registro de rutas
		this.view(); // update changes in pending routes
	}

	beforeRender = ruta.beforeRender;
	rowCalc = ruta.rowCalc;

	row(data, status) {
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº" class="hide-sm">${status.count}</td>
			<td data-cell="${i18n.get("lblOrigen")}">${data.origen}</td>
			<td data-cell="${i18n.get("lblFechaSalida")}">${i18n.isoDate(data.dt1)}</td>
			<td data-cell="${i18n.get("lblHoraSalida")}">${i18n.isoTimeShort(data.dt1)}</td>
			<td data-cell="${i18n.get("lblDestino")}">${data.destino}${data.spanFlag}</td>
			<td data-cell="${i18n.get("lblFechaLlegada")}">${i18n.isoDate(data.dt2)}</td>
			<td data-cell="${i18n.get("lblHoraLlegada")}">${i18n.isoTimeShort(data.dt2)}</td>
			<td data-cell="${i18n.get("lblTransporte")}">${i18n.getItem("tiposDesp", data.desp)}</td>
			<td data-cell="Asociar Etapa"><input type="checkbox" value="${data.id}"/></td>
		</tr>`;
	}

	view() {
		super.view(rutas.getRutasPendientes());
	}
}
