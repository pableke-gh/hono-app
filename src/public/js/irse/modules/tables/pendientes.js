
import TableHTML from "../../../components/TableHTML.js";
import tabs from "../../../components/Tabs.js";
import i18n from "../../../i18n/langs.js";

import irse from "../../model/Irse.js";
import ruta from "../../model/Ruta.js";
import rutas from "../../model/Rutas.js";
import gasto from "../../model/Gasto.js";

import observer from "../../../core/util/Observer.js";
import form from "../irse.js"

/*********** ASOCIAR RUTAS / GASTOS ***********/
export default class RutaPendientes extends TableHTML {
	init() {
		irse.getNumRutasPendientes = this.size;
		observer.subscribe("link", this.link).subscribe("unlink", this.unlink);
		tabs.setAction("rtog", () => {
			const rutas = this.getChecked();
			if (!rutas || !rutas.length) // no hay rutas seleccionadas
				return form.showError("errLinkRuta"); // mensaje de error
			form.getPaso5().upload(rutas.join()); // upload PK de las rutas seleccionadas
		});
	}

	getChecked = () => this.getBody().$$(":checked").map(el => +el.value);
	link = data => {
		if (!gasto.isFactura(data)) return; // no es factura
		rutas.link(this.getChecked(), data.id); // link gasto id to rutas
		tabs.goTo(5); // allways go back to step 5
		this.view(); // update changes in pending routes
	}
	unlink = data => {
		if (!gasto.isFactura(data)) return; // no es factura
		rutas.unlink(data.id); // actualizo el registro de rutas
		this.view(); // update changes in pending routes
	}

	beforeRender = ruta.beforeRender;
	row(data, status) {
		const flag = ruta.isPrincipal(data) ? '<span class="text-warn icon"><i class="fal fa-flag-checkered"></i></span>' : "";
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº" class="hide-sm">${status.count}</td>
			<td data-cell="${i18n.get("lblOrigen")}">${data.origen}</td>
			<td data-cell="${i18n.get("lblFechaSalida")}">${i18n.isoDate(data.dt1)}</td>
			<td data-cell="${i18n.get("lblHoraSalida")}">${i18n.isoTimeShort(data.dt1)}</td>
			<td data-cell="${i18n.get("lblDestino")}">${data.destino}${flag}</td>
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
