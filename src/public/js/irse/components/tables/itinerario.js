
import TableHTML from "../../../core/components/tables/Table.js";
import tabs from "../../../core/components/tabs/TabsOld.js";
import i18n from "../../../core/i18n/langs.js";

import ruta from "../../model/Ruta.js";
import rutas from "../../model/Rutas.js";

export default class Itinerario extends TableHTML {
	connectedCallback() { // tabla del paso 0 (organicas del perfil)
		tabs.setViewEvent("itinerario", () => this.view()); // render rows
	}

	beforeRender(resume) { ruta.beforeRender(resume); } // overrride
	beforeRow(data, i, resume) { ruta.rowCalc(data, i, resume); } // overrride
	row(data, i) { 
		const flag = ruta.isPrincipal(data) ? '<span class="text-warn icon"><i class="fal fa-flag-checkered"></i></span>' : "";
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº" class="hide-sm">${i + 1}</td>
			<td data-cell="${i18n.get("lblOrigen")}">${data.origen}</td>
			<td data-cell="${i18n.get("lblFechaSalida")}">${i18n.isoDate(data.dt1)}</td>
			<td data-cell="${i18n.get("lblHoraSalida")}">${i18n.isoTimeShort(data.dt1)}</td>
			<td data-cell="${i18n.get("lblDestino")}">${data.destino}${flag}</td>
			<td data-cell="${i18n.get("lblFechaLlegada")}">${i18n.isoDate(data.dt2)}</td>
			<td data-cell="${i18n.get("lblHoraLlegada")}">${i18n.isoTimeShort(data.dt2)}</td>
			<td data-cell="${i18n.get("lblTransporte")}">${i18n.getItem("tiposDesp", data.desp)}</td>
			<td data-cell="Km." class="hide-sm">${i18n.isoFloat(data.km2) || "-"}</td>
		</tr>`;
	}
	afterRender = resume => {
		resume.totKmCalcFmt = (resume.totKmCalc > 0) ? i18n.isoFloat(resume.totKmCalc) : "-";
	}

	view() {
		return super.view(rutas.getRutas());
	}
}
