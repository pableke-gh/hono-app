
import Table from "../../../components/Table.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js";
import ruta from "../../model/Ruta.js";
import rutas from "../../model/Rutas.js";
import form from "../irse.js"

export default class Rutas extends Table {
	constructor(form) { // tabla del paso 2 (rutas maps)
		super(form.querySelector("#rutas"), { msgEmptyTable: "msgRutasEmpty" });
	}

	init() {
		const fnGt1 = () => ((this.size() > 1) && irse.isEditable());
		form.set("is-rutas-gt-1", () => (this.size() > 1)).set("is-editable-rutas-gt-1", fnGt1);
		this.set("#main", data => {
			rutas.setRutaPrincipal(data);
			form.setChanged(true);
			this.refresh();
		});
	}

	beforeRender(resume) {
		ruta.beforeRender(resume);
		resume.matricula = form.getval("#matricula");
	}

	rowCalc = ruta.rowCalc;
	row(data, resume) {
		const isPrincipal = ruta.isPrincipal(data);
		const TPL_FLAG = '<span class="text-warn icon"><i class="fal fa-flag-checkered"></i></span>';
		const TPL_ORDINARIO = `<a href="#main" class="${isPrincipal ? "hide" : ""}">${data.destino}</a>`;
		const TPL_PRINCIPAL = `<span class="${isPrincipal ? "" : "hide"}">${data.destino}${TPL_FLAG}</span>`;
		const TPL_READONLY = isPrincipal ? (data.destino + TPL_FLAG) : data.destino;
		const destino = irse.isEditable() ? (TPL_ORDINARIO + TPL_PRINCIPAL) : TPL_READONLY;
		data["update-principal"] = (el, data) => {
			el.children.forEach(el => el.hide());
			el.children[+ruta.isPrincipal(data)].show();
		}

		const matricula = ruta.isVehiculoPropio(data) ? (" (" + resume.matricula + ")") : "";
		const remove = irse.isEditable() ? '<a href="#remove"><i class="fas fa-times action text-red resize"></i></a>' : "";
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº" class="hide-sm">${resume.count}</td>
			<td data-cell="${i18n.get("lblOrigen")}">${data.origen}</td>
			<td data-cell="${i18n.get("lblFechaSalida")}">${i18n.isoDate(data.dt1)}</td>
			<td data-cell="${i18n.get("lblHoraSalida")}">${i18n.isoTimeShort(data.dt1)}</td>
			<td data-cell="${i18n.get("lblDestino")}" class="table-refresh" data-refresh="update-principal">${destino}</td>
			<td data-cell="${i18n.get("lblFechaLlegada")}">${i18n.isoDate(data.dt2)}</td>
			<td data-cell="${i18n.get("lblHoraLlegada")}">${i18n.isoTimeShort(data.dt2)}</td>
			<td data-cell="${i18n.get("lblTransporte")}">${i18n.getItem("tiposDesp", data.desp) + matricula}</td>
			<td data-cell="Km." class="hide-sm">${i18n.isoFloat(data.km2) || "-"}</td>
			<td data-cell="${i18n.get("lblAcciones")}" class="no-print">${remove}</td>
		</tr>`;
	}

	render() {
		super.render(rutas.getRutas());
	}

	afterRender(resume) {
		resume.impKm = resume.totKm * ruta.getImpGasolina();
		resume.totKmCalcFmt = (resume.totKmCalc > 0) ? i18n.isoFloat(resume.totKmCalc) : "-";

		const CT = { desp: 0, mask: 4 }; //default CT
		CT.origen = CT.destino = "Cartagena, España";
		CT.pais = CT.pais1 = CT.pais2 = "ES";

		const last = rutas.getLlegada() || CT;
		rutas.getNumRutasUnlinked = () => resume.unlinked; // redefine calc
		const data = { origen: last.destino, f1: last.dt2, h1: last.dt2, f2: last.dt2, matricula: resume.matricula };
		form.setData(data, ".ui-ruta").delAttr("#f1", "max").restart("#destino").hide(".grupo-matricula");
		if (!last.dt1) // primera ruta?
			form.setFocus("#f1");
	}
}
