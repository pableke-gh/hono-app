
import Table from "../../../components/Table.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js";
import ruta from "../../model/Ruta.js";
import rutas from "../../model/Rutas.js";
import form from "../irse.js"

export default class Kilometraje extends Table {
	constructor(form) { // tabla del paso 6 (kilometraje del vehiculo propio)
		super(form.querySelector("#km"));
	}

	init() {
		const perfil = form.getPerfil();
		irse.getImpGasolina = ruta.getImpGasolina;
		irse.getImpKm = rutas.getImpKm = this.getImpKm;
		irse.getNumRutasVp = rutas.getNumRutasVp = this.size;
		irse.getNumRutasVpMun = () => (this.size() && perfil.isMun());
		irse.getNumRutasVpMaps = () => (this.size() && !perfil.isMun());

		form.set("is-justifi-km", this.isJustifiKm);
		this.setChange("km1", (data, el) => {
			data.km1 = i18n.toFloat(el.value);
			this.refresh(); // recalcula tabla completa
			form.stringify("#etapas", rutas.getRutas()).refresh(irse); // save changes + update form
		});
	}

	getTotKm = () => this.getProp("totKm");
	getImpKm = () => this.getProp("impKm");
	isJustifiKm = () => this.getProp("justifi");

	// render tables
	beforeRender = resume => {
		resume.impKm = resume.totKm = resume.totKmCalc = 0;
	}
	rowCalc = (data, resume) => {
		resume.totKm += data.km1;
		resume.totKmCalc += data.km2;
		data.impKm = ruta.getImpKm(data);
		resume.impKm += data.impKm;
	}

	row = ruta => {
		const km1 = i18n.isoFloat(ruta.km1);
		const cell = irse.isEditable() ? `<input type="text" name="km1" value="${km1}" class="ui-float"/>` : km1;
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

	render() {
		super.render(rutas.getRutasVehiculoPropio());
	}

	afterRender = resume => {
		resume.totKm = resume.totKm.round(2);
		resume.totKmCalc = resume.totKmCalc.round(2);
		resume.impKm = (resume.totKm * ruta.getImpGasolina()).round(2);
		resume.justifi = (resume.totKmCalc + .01) < resume.totKm;
	}
}
