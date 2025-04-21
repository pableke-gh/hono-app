
import i18n from "../../../i18n/langs.js";
import iris from "../../model/Iris.js";
import ruta from "./Ruta.js";

function RutaVehiculoPropio() {
	const self = this; //self instance
	const GASOLINA = .26; //euros/kilometro

	this.getImpGasolina = () => GASOLINA;
	this.getImpKm = ruta => (ruta.km1 * GASOLINA);

	// render tables
	this.beforeRender = ruta.beforeRender;
	this.rowCalc = (data, resume) => {
		ruta.rowCalc(data, resume); // common calculations
		data.impKm = self.getImpKm(data);
		resume.impKm += data.impKm;
	}

	this.row = (ruta, status, resume) => {
		self.rowCalc(ruta, resume);
		const km1 = i18n.isoFloat(ruta.km1);
		const cell = iris.isEditable() ? `<input type="text" name="km1" value="${km1}" tabindex="100" class="ui-float tc"/>` : km1;
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="#{msg['lbl.origen.etapa']}">${ruta.origen}</td>
			<td data-cell="#{msg['lbl.fecha.salida']}">${i18n.isoDate(ruta.dt1)}</td>
			<td data-cell="#{msg['lbl.hora.salida']}">${i18n.isoTimeShort(ruta.dt1)}</td>
			<td data-cell="#{msg['lbl.destino.etapa']}">${ruta.destino}</td>
			<td data-cell="#{msg['lbl.fecha.llegada']}">${i18n.isoDate(ruta.dt2)}</td>
			<td data-cell="#{msg['lbl.hora.llegada']}">${i18n.isoTimeShort(ruta.dt2)}</td>
			<td data-cell="#{msg['lbl.medio.trans']}">${i18n.getItem("tiposDesp", ruta.desp)}</td>
			<td data-cell="Google km">${i18n.isoFloat(ruta.km2) || "-"}</td>
			<td data-cell="#{msg['lbl.tus.km']}">${cell}</td>
			<td data-cell="#{msg['lbl.importe']}" data-template="$impKm; €" class="text-render">${i18n.isoFloat(ruta.impKm)} €</td>
		</tr>`;
	}

    this.tfoot = resume => {
		return `<tr>
			<td colspan="7">Etapas: ${resume.size}</td>
			<td class="tb-data-tc hide-xs text-render" data-template="$totKmCalc;">${i18n.isoFloat(resume.totKmCalc)}</td>
			<td class="tb-data-tc hide-xs text-render" data-template="$totKm;">${i18n.isoFloat(resume.totKm)}</td>
			<td class="tb-data-tc hide-xs text-render" data-template="$impKm; €">${i18n.isoFloat(resume.impKm)} €</td>
		</tr>`;
	}

	this.afterRender = resume => {
		resume.impKm = resume.totKm * GASOLINA;
		resume.justifi = (resume.totKmCalc + .01) < resume.totKm;
	}

	this.getTable = () => ({ msgEmptyTable: "msgRutasEmpty", beforeRender: self.beforeRender, rowCalc: self.rowCalc, onRender: self.row, onFooter: self.tfoot });
}

export default new RutaVehiculoPropio();
