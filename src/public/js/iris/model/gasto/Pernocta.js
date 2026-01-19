
import i18n from "../../i18n/langs.js";
import organica from "../Organica.js";

function Pernocatas() {
	const self = this; //self instance

	this.getNumNoches = pernocta => pernocta.num;
	this.getImpNoche = pernocta => pernocta.imp2;

	this.beforeRender = resume => {
		resume.imp1 = resume.imp2 = resume.numNoches = 0;
		resume.impTotal = resume.impMin = 0;
	}

	this.rowCalc = (data, resume) => {
		resume.imp1 += data.imp1; // importe justificado por el usuario en el paso 5
		resume.imp2 += data.imp2; // importe por noche auto-calculado por pais
		resume.numNoches += data.num; // numero total de noches

		data.impTotal = data.imp2 * data.num; // importe total = (imp./noche) * (num noches)
		data.impMin = organica.isEUT() ? data.imp1 : Math.min(data.imp1, data.impTotal);
		resume.impMin += data.impMin; // #{irse.form.getMinPernoctaI18n(g)}
	}

	this.row = (data, status, resume) => {
		self.rowCalc(data, resume);
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº">${status.count}</td>
			<td data-cell="${i18n.get("lblPais")}">${data.desc}</td>
			<td data-cell="${i18n.get("lblFechaInicio")}">${i18n.isoDate(data.f1)}</td>
			<td data-cell="${i18n.get("lblFechaFin")}">${i18n.isoDate(data.f2)}</td>
			<td data-cell="${i18n.get("lblNoches")}">${data.num}</td>
			<td data-cell="${i18n.get("lblImpNoche")}">${i18n.isoFloat(data.imp2)} €</td>
			<td data-cell="${i18n.get("lblImpTotal")}">${i18n.isoFloat(data.impTotal)} €</td>
			<td data-cell="${i18n.get("lblImpJustifi")}">${i18n.isoFloat(data.imp1)} €</td>
			<td data-cell="${i18n.get("lblImpPercibir")}">${i18n.isoFloat(data.impMin)} €</td>
		</tr>`
	}

	this.afterRender = resume => {
		resume.impTotal = resume.imp2 * resume.numNoches; // importe total por noche
	}

	this.getTable = () => ({ msgEmptyTable: "msgPernoctasEmpty", beforeRender: self.beforeRender, rowCalc: self.rowCalc, onRender: self.row, afterRender: self.afterRender });
}

export default new Pernocatas();
