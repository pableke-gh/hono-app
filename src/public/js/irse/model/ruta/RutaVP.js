
import i18n from "../../i18n/langs.js";
import irse from "../../model/Irse.js";
import ruta from "./Ruta.js";

class RutaVP {
	beforeRender = ruta.beforeRender;
	rowCalc = (data, resume) => {
		ruta.rowCalc(data, resume); // common calculations
		data.impKm = ruta.getImpKm(data);
		resume.impKm += data.impKm;
	}

	row = (ruta, status, resume) => {
		this.rowCalc(ruta, resume);
		const km1 = i18n.isoFloat(ruta.km1);
		const cell = irse.isEditable() ? `<input type="text" name="km1" value="${km1}" tabindex="100" class="ui-float tc"/>` : km1;
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="${i18n.get("lblOrigen")}">${ruta.origen}</td>
			<td data-cell="${i18n.get("lblFechaSalida")}">${i18n.isoDate(ruta.dt1)}</td>
			<td data-cell="${i18n.get("lblHoraSalida")}">${i18n.isoTimeShort(ruta.dt1)}</td>
			<td data-cell="${i18n.get("lblDestino")}">${ruta.destino}</td>
			<td data-cell="${i18n.get("lblFechaLlegada")}">${i18n.isoDate(ruta.dt2)}</td>
			<td data-cell="${i18n.get("lblHoraLlegada")}">${i18n.isoTimeShort(ruta.dt2)}</td>
			<td data-cell="${i18n.get("lblTransporte")}">${i18n.getItem("tiposDesp", ruta.desp)}</td>
			<td data-cell="Google km">${i18n.isoFloat(ruta.km2) || "-"}</td>
			<td data-cell="${i18n.get("lblTusKm")}">${cell}</td>
			<td data-cell="${i18n.get("lblImporte")}" class="table-refresh" data-refresh="text-render" data-template="$impKm; €">${i18n.isoFloat(ruta.impKm)} €</td>
		</tr>`;
	}

	afterRender = resume => {
		resume.impKm = resume.totKm * ruta.getImpGasolina();
		resume.justifi = (resume.totKmCalc + .01) < resume.totKm;
		irse.getImpKm = () => resume.impKm;
	}

	getTable = () => ({ msgEmptyTable: "msgRutasEmpty", beforeRender: this.beforeRender, rowCalc: this.rowCalc, onRender: this.row });
}

export default new RutaVP();
