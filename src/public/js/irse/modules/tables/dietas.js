
import Table from "../../../components/Table.js";
import i18n from "../../i18n/langs.js";
import irse from "../../model/Irse.js";
import form from "../irse.js"

// tabla del paso 6 resumen de dietas
export default class Dietas extends Table {
	constructor(form) {
		super(form.querySelector("#dietas"));
	}

	init() {
		form.set("is-dietas", this.size);
		irse.getImpDietas = () => this.getProp("percibir");
		this.setChange("dietas", (dieta, element) => {
			dieta.imp1 = +element.value; // [0, 0.5, 1, 1.5, 2, ...]
			this.refresh(); // update table
			form.refresh(irse); // save changes + update view
		});
	}

	beforeRender = resume => {
		resume.dias = resume.impMax = resume.reducido = resume.percibir =  0;
	}

	rowCalc = (data, resume) => {
		const isFirst = (resume.index == 0);
		const isLast = (resume.count == resume.size);

		data.maxDietas = (isFirst || isLast) ? (data.estado / 2) : data.num;
		data.impMax = data.imp2 * data.maxDietas;
		if (isFirst && data.maxDietas == 1)
			data.reducido = (1-data.imp1) * data.imp2;
		else if (isFirst || isLast)
			data.reducido = data.imp1 ? 0 : data.impMax;
		else
			data.reducido = (data.num - data.imp1) * data.imp2;
		data.percibir = data.impMax - data.reducido; 

		resume.dias += data.num;
		resume.impMax += data.impMax;
		resume.reducido += data.reducido;
		resume.percibir += data.percibir;
	}

	row(dieta) {
		const fnDietas = (dieta, maxDietas) => {
			let output = '<select name="dietas" is="data-list" class="ui-sm">';
			for (let i = 0; i <= maxDietas; i += .5)
				output += '<option value="' + i + ((dieta == i) ? '" selected>' : '">') + i18n.isoFloat1(i) + '</option>'
			return output + "</select>";
		}
		const dietas = irse.isEditable() ? fnDietas(dieta.imp1, dieta.maxDietas) : i18n.isoInt(dieta.imp1);
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="${i18n.get("lblPeriodo")}">${dieta.desc}</td>
			<td data-cell="${i18n.get("lblPais")}">${dieta.nombre}</td>
			<td data-cell="${i18n.get("lblFechaInicio")}">${i18n.isoDate(dieta.f1)}</td>
			<td data-cell="${i18n.get("lblFechaFin")}">${i18n.isoDate(dieta.f2)}</td>
			<td data-cell="${i18n.get("lblDias")}">${i18n.isoInt(dieta.num)}</td>
			<td data-cell="${i18n.get("lblDietasPropuestas")}">${i18n.isoFloat1(dieta.maxDietas)}</td>
			<td data-cell="${i18n.get("lblImpDietaDia")}">${i18n.isoFloat(dieta.imp2)} €</td>
			<td data-cell="${i18n.get("lblImpPropuesto")}">${i18n.isoFloat(dieta.impMax)} €</td>
			<td data-cell="${i18n.get("lblTusDietas")}">${dietas}</td>
			<td data-cell="${i18n.get("lblReduccion")}" class="table-refresh" data-refresh="text-render" data-template="$reducido; €">${i18n.isoFloat(dieta.reducido)} €</td>
			<td data-cell="${i18n.get("lblImpTotal")}" class="table-refresh" data-refresh="text-render" data-template="$percibir; €">${i18n.isoFloat(dieta.percibir)} €</td>
		</tr>`;
	}

	afterRender() {
		form.refresh(irse);
	}
}
