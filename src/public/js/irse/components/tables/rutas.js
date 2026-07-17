
import TableHTML from "../../../core/components/tables/Table.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js";
import ruta from "../../model/Ruta.js";
import rutas from "../../model/Rutas.js";
import form from "../../modules/irse.js"

import observer from "../../../core/util/Observer.js";
import ct from "../../data/place-ct.js";

export default class TableRutas extends TableHTML {
	init() { // tabla del paso 2 (rutas maps)
		const fnGt1 = () => ((this.size() > 1) && irse.isEditable());
		form.set("is-rutas-gt-1", () => (this.size() > 1)).set("is-editable-rutas-gt-1", fnGt1);
	}

	setMain(data) {
		data = data || this.getCurrent();
		rutas.setRutaPrincipal(data);
		form.setChanged(true);
		this.reload();
	}

	beforeRender(resume) {
		ruta.beforeRender(resume);
		resume.matricula = irse.getMatricula();
	}
	beforeRow(data, i, resume) {
		super.beforeRow(data, i, resume);
		ruta.rowCalc(data, i, resume);
	}
	row(data, i, resume) {
		const isPrincipal = ruta.isPrincipal(data);
		const TPL_FLAG = '<span class="text-warn icon"><i class="fal fa-flag-checkered"></i></span>';
		const TPL_ORDINARIO = `<a href="#main" class="${isPrincipal ? "hide" : ""}">${data.destino}</a>`;
		const TPL_PRINCIPAL = `<span class="${isPrincipal ? "" : "hide"}">${data.destino}${TPL_FLAG}</span>`;
		const TPL_READONLY = isPrincipal ? (data.destino + TPL_FLAG) : data.destino;
		const destino = irse.isEditable() ? (TPL_ORDINARIO + TPL_PRINCIPAL) : TPL_READONLY;

		const matricula = ruta.isVehiculoPropio(data) ? (" (" + resume.matricula + ")") : "";
		const remove = irse.isEditable() ? '<a href="#remove"><i class="fas fa-times action text-red resize"></i></a>' : "";
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº" class="hide-sm">${resume.count}</td>
			<td data-cell="${i18n.get("lblOrigen")}">${data.origen}</td>
			<td data-cell="${i18n.get("lblFechaSalida")}">${i18n.isoDate(data.dt1)}</td>
			<td data-cell="${i18n.get("lblHoraSalida")}">${i18n.isoTimeShort(data.dt1)}</td>
			<td data-cell="${i18n.get("lblDestino")}" class="table-reload" data-reload="update-principal">${destino}</td>
			<td data-cell="${i18n.get("lblFechaLlegada")}">${i18n.isoDate(data.dt2)}</td>
			<td data-cell="${i18n.get("lblHoraLlegada")}">${i18n.isoTimeShort(data.dt2)}</td>
			<td data-cell="${i18n.get("lblTransporte")}">${i18n.getItem("tiposDesp", data.desp) + matricula}</td>
			<td data-cell="Km." class="hide-sm">${i18n.isoFloat(data.km2) || "-"}</td>
			<td data-cell="${i18n.get("lblAcciones")}" class="no-print">${remove}</td>
		</tr>`;
	}
	afterRender(resume) {
		resume.impKm = resume.totKm * ruta.getImpGasolina();
		resume.totKmCalcFmt = (resume.totKmCalc > 0) ? i18n.isoFloat(resume.totKmCalc) : "-";

		const last = rutas.getLlegada() || ct;
		const data = { oid: last.did, origen: last.destino, f1: last.dt2, h1: last.dt2, f2: last.dt2, matricula: resume.matricula };
		form.setData(data, ".ui-ruta").delAttr("#f1", "max").restart("destino").hide(".grupo-matricula");
	}

	render() { super.render(rutas.getRutas()); }
	flush() { form.setChanged(true); super.flush(); }
	connectedCallback() {
		this.setMsgEmpty("msgRutasEmpty");
		this.set("#main", data => this.setMain(data));
		observer.subscribe("close", () => this.view(rutas.getRutas()));
		this.set("update-principal", (el, data) => {
			el.children.forEach(el => el.hide()); // hide all
			return el.children[+ruta.isPrincipal(data)].show();
		});
	}
}
