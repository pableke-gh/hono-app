
import coll from "../../../components/CollectionHTML.js";
import i18n from "../../../i18n/langs.js";
import dom from "../../../lib/uae/dom-box.js";
import organicas from "./organicas.js";

function IrseDietas() {
	const self = this; //self instance
	const resume = { dias: 0, impMax: 0, reducido: 0, percibir: 0 };
	const STYLES = {
		f1: i18n.isoDate, f2: i18n.isoDate,
		imp1: i18n.isoFloat1, imp2: i18n.isoFloat, impMax: i18n.isoFloat, maxDietas: i18n.isoFloat1, reducido: i18n.isoFloat, percibir: i18n.isoFloat,
		dietas: (val, dieta, j) => { //calculado
			let output = "";
			for (let i = 0; i <= dieta.maxDietas; i += .5)
				output += '<option value="' + i + ((dieta.imp1 == i) ? '" selected>' : '">') + i18n.isoFloat1(i) + '</option>'
			return output;
		}
	}

	this.getImpMax = () => resume.impMax;
	this.getImpReducido = () => resume.reducido;
	this.getImpPercibir = () => resume.percibir;
	this.init = () => {
		resume.dias = resume.impMax = resume.reducido = resume.percibir = 0;
		return self;
	}

	this.render = tab6 => { // Build table step 7
		const bruto = tab6.querySelector("#imp-bruto");
		const divData = tab6.querySelector("#dietas-data") || coll.getDivNull();
		const gasolina = tab6.querySelector("#imp-gasolina-km") || coll.getDivNull();
		gasolina.innerHTML = i18n.isoFloat(IRSE.gasolina);

		const manutenciones = coll.parse(divData.innerText) || [];
		dom.onChangeTable("#manutenciones", table => {
			const tr = resume.row;
			const dieta = resume.data;
			dieta.imp1 = +resume.element.value;

			divData.innerText = JSON.stringify(manutenciones);
			dom.tfoot(table, resume, STYLES)
				.setText(tr.cells[9], i18n.isoFloat(dieta.reducido) + " €")
				.setText(tr.cells[10], i18n.isoFloat(dieta.percibir) + " €")
				.setHtml("#imp-dietas", i18n.isoFloat(resume.percibir) + " €")
				.setValue("#gastos-dietas", divData.innerText);
			bruto.innerHTML = organicas.getTotalFmt();
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
			bruto.innerHTML = organicas.getTotalFmt();
		});

		dom.table("#manutenciones", manutenciones, resume, STYLES)
			.setHtml("#imp-dietas", i18n.isoFloat(resume.percibir) + " €");
		bruto.innerHTML = organicas.getTotalFmt();
		return self;
	}
}

export default new IrseDietas();
