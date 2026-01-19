
import i18n from "../../i18n/langs.js";
import iris from "../../model/Iris.js";
import ruta from "./Ruta.js";

function RutaVehiculoPropio() {
	const self = this; //self instance

	this.getImpGasolina = ruta.getImpGasolina;
	this.getImpKm = ruta.getImpKm;

	// render tables
	this.beforeRender = ruta.beforeRender;
	this.rowCalc = (data, resume) => {
		ruta.rowCalc(data, resume); // common calculations
		data.impKm = ruta.getImpKm(data);
		resume.impKm += data.impKm;
	}

	this.row = (ruta, status, resume) => {
		self.rowCalc(ruta, resume);
		const km1 = i18n.isoFloat(ruta.km1);
		const cell = iris.isEditable() ? `<input type="text" name="km1" value="${km1}" tabindex="100" class="ui-float tc"/>` : km1;
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

	this.afterRender = resume => {
		resume.impKm = resume.totKm * ruta.getImpGasolina();
		resume.justifi = (resume.totKmCalc + .01) < resume.totKm;
		iris.getImpKm = () => resume.impKm;
	}

	this.getTable = () => ({ msgEmptyTable: "msgRutasEmpty", beforeRender: self.beforeRender, rowCalc: self.rowCalc, onRender: self.row });
}

export default new RutaVehiculoPropio();
