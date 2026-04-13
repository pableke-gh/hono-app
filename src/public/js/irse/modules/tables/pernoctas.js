
import TableHTML from "../../../components/TableHTML.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js"
import rutas from "../../model/Rutas.js";
import gastos from "../../model/Gastos.js";
import form from "../irse.js"

// tabla del paso 6 resumen de transportes
export default class Pernoctas extends TableHTML {
	init = () => {
		this.setMsgEmpty("No existen gastos por alojamiento asociados a la comunicación."); // msg.no.gastos.extra
		irse.getNochesPendientes = () => (rutas.getNumNoches() - this.getNumNoches());
		irse.getImpPernoctas = this.getImporte;
	}

	getImporte = () => this.getProp("impMin");
	getNumNoches = () => this.getProp("numNoches");
	getImpNoche = () => this.getProp("imp2");

	beforeRender = resume => {
		resume.imp1 = resume.imp2 = resume.numNoches = 0;
		resume.impTotal = resume.impMin = 0;
	}
	beforeRow = (data, resume) => {
		resume.imp1 += data.imp1; // importe justificado por el usuario en el paso 5
		resume.imp2 += data.imp2; // importe por noche auto-calculado por pais
		resume.numNoches += data.num; // numero total de noches

		data.impTotal = data.imp2 * data.num; // importe total = (imp./noche) * (num noches)
		data.impMin = form.getOrganicas().isEUT() ? data.imp1 : Math.min(data.imp1, data.impTotal);
		resume.impMin += data.impMin;
	}
	row = (data, resume) => `<tr class="tb-data tb-data-tc">
		<td data-cell="Nº">${resume.count}</td>
		<td data-cell="${i18n.get("lblPais")}">${data.desc}</td>
		<td data-cell="${i18n.get("lblFechaInicio")}">${i18n.isoDate(data.f1)}</td>
		<td data-cell="${i18n.get("lblFechaFin")}">${i18n.isoDate(data.f2)}</td>
		<td data-cell="${i18n.get("lblNoches")}">${data.num}</td>
		<td data-cell="${i18n.get("lblImpNoche")}">${i18n.isoFloat(data.imp2)} €</td>
		<td data-cell="${i18n.get("lblImpTotal")}">${i18n.isoFloat(data.impTotal)} €</td>
		<td data-cell="${i18n.get("lblImpJustifi")}">${i18n.isoFloat(data.imp1)} €</td>
		<td data-cell="${i18n.get("lblImpPercibir")}">${i18n.isoFloat(data.impMin)} €</td>
	</tr>`
	afterRender = resume => {
		resume.impTotal = resume.imp2 * resume.numNoches; // importe total por noche
	}

	render() {
		super.render(gastos.getPernoctas());
	}
}
