
import Table from "../../../components/Table.js";
//import dom from "../../lib/dom-box.js";
import i18n from "../../i18n/langs.js";
import irse from "../../model/Irse.js";
import form from "../irse.js"

/*const resume = { dias: 0, impMax: 0, reducido: 0, percibir: 0 };
const STYLES = {
	f1: i18n.isoDate, f2: i18n.isoDate,
	imp1: i18n.isoFloat1, imp2: i18n.isoFloat, impMax: i18n.isoFloat, maxDietas: i18n.isoFloat1, reducido: i18n.isoFloat, percibir: i18n.isoFloat,
	dietas: (val, dieta, j) => { //calculado
		let output = "";
		for (let i = 0; i <= dieta.maxDietas; i += .5)
			output += '<option value="' + i + ((dieta.imp1 == i) ? '" selected>' : '">') + i18n.isoFloat1(i) + '</option>'
		return output;
	}
}*/

// tabla del paso 6 resumen de dietas
export default class Dietas extends Table {
	constructor(form) {
		super(form.querySelector("#dietas"));
	}

	init() {
		form.set("is-dietas", this.size);
		irse.getImpDietas = () => this.getProp("percibir");
		this.setChange("dietas", (dieta, element) => {
			dieta.imp1 = +element.value;
			this.refresh(); // update table
			form.refresh(irse); // update view
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
		data.reducido = isLast ? (data.imp1 ? 0 : data.impMax) : ((data.num - data.imp1) * data.imp2);
		data.percibir = data.impMax - data.reducido; 

		resume.dias += data.num;
		resume.impMax += data.impMax;
		resume.reducido += data.reducido;
		resume.percibir += data.percibir;
	}

	row(dieta) {
		const fnDietas = (dieta, maxDietas) => {
			let output = '<select name="dietas">';
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

	/*render = tab6 => { // Build table step 7
		const divData = tab6.querySelector("#dietas-data") || coll.getDivNull();
		const manutenciones = coll.parse(divData.innerText) || [];
		resume.dias = resume.impMax = resume.reducido = resume.percibir = 0;

		dom.onChangeTable("#manutenciones", table => {
			const tr = resume.row;
			const dieta = resume.data;
			dieta.imp1 = +resume.element.value;

			divData.innerText = JSON.stringify(manutenciones);
			dom.tfoot(table, resume, STYLES).setValue("#gastos-dietas", divData.innerText);

			tr.cells[9].innerHTML = i18n.isoFloat(dieta.reducido) + " €";
			tr.cells[10].innerHTML = i18n.isoFloat(dieta.percibir) + " €";
			form.refresh(irse);
		}).onRenderTable("#manutenciones", table => {
			let size = coll.size(manutenciones);
			if (size == 0) //hay dietas?
				return; // tabla vacia

			let first = manutenciones[0];
			first.maxDietas = first.estado / 2;
			first.impMax = first.imp2 * first.maxDietas;
			if (first.maxDietas == 1)
				first.reducido = (1-first.imp1) * first.imp2;
			else
				first.reducido = first.imp1 ? 0 : first.impMax;
			first.percibir = first.impMax - first.reducido;
			first.periodo = i18n.get("firstDay");

			//adjust last dieta
			resume.dias = 1;
			resume.impMax = first.impMax;
			resume.reducido = first.reducido;
			resume.percibir = first.percibir;
			if (size == 1)
				return;

			size--;
			for (let i = 1; i < size; i++) {
				let dieta = manutenciones[i];
				dieta.periodo = i18n.get("medDay");
				dieta.impMax = dieta.num * dieta.imp2;
				dieta.reducido = (dieta.num-dieta.imp1) * dieta.imp2;
				dieta.percibir = dieta.impMax - dieta.reducido;
				dieta.maxDietas = dieta.num;
				resume.dias += dieta.num;
				resume.impMax += dieta.impMax;
				resume.reducido += dieta.reducido;
				resume.percibir += dieta.percibir;
			}

			if (size > 0) {
				let last = manutenciones.last(); //extract last dieta
				last.maxDietas = last.estado / 2;
				last.impMax = last.imp2 * last.maxDietas;
				last.reducido = last.imp1 ? 0 : last.impMax;
				last.percibir = last.impMax - last.reducido;
				last.periodo = i18n.get("lastDay");

				//adjust last dieta
				resume.dias++;
				resume.impMax += last.impMax;
				resume.reducido += last.reducido;
				resume.percibir += last.percibir;
			}

			divData.innerText = JSON.stringify(manutenciones);
			form.refresh(irse);
		});

		dom.table("#manutenciones", manutenciones, resume, STYLES);
	}*/
}
