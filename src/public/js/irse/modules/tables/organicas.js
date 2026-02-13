
import Table from "../../../components/Table.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js";
import perfil from "../perfil.js";
import rutas from "../rutas.js";
import dietas from "../dietas.js";
import imputacion from "../imputacion.js";
import form from "../irse.js";

class IrseOrganicas extends Table {
	constructor() {
		super(form.querySelector("table#imputacion"));
		this.setMsgEmpty("No existen orgánicas asociadas a la comunicación.");
	}

	getImpTransporte = () => this.getProp("totTransporte");
	getImpPernoctas = () => this.getProp("totPernoctas");
	getImpDietas = () => this.getProp("totManutenciones");
	getImpAc = () => this.getProp("totAc");

	getTotTransporte = () => (rutas.getImpKm() + window.IRSE.impTransporte + window.IRSE.impExtraTrans);
	getTotPernoctas = () => (window.IRSE.minPernoctas + window.IRSE.impExtraAloja);
	getTotDietas = () => (dietas.getImpPercibir() + window.IRSE.impExtraDietas);
	getImpBruto = () => (this.getTotTransporte() + this.getTotPernoctas() + this.getTotDietas() + window.IRSE.totAc);
	getImpTotal = () => (this.getImpBruto() - window.IRSE.irpf);
	getTotalFmt = () => (i18n.isoFloat(this.getImpTotal()) + " €");

	render = () => {
		if (perfil.isEmpty()) // validate paso 0
			return !form.showError("errImputacion");

		// auto-build mono-organica
		const organicas = []; // container
		const org = perfil.getOrganicas()[0];
		const fnAdd = (subtipo, imp) => {
			if (imp < 1) return; // sin importe que asociar al gasto
			const DATA = { num: org.id, cod: org.o, desc: org.dOrg };
			const gasto = Object.assign({ subtipo }, DATA);
			gasto.nombre = imputacion.get(subtipo, org);
			gasto.imp1 = imp;
			organicas.push(gasto);
		}

		fnAdd(1, this.getTotDietas());
		fnAdd(2, this.getTotPernoctas());
		fnAdd(3, this.getTotTransporte());
		fnAdd(4, window.IRSE.totAc);

		form.stringify("#imp-org", organicas); // save changes
		return Table.prototype.render.call(this, organicas); // super keyword
	}

	beforeRender(resume) {
		resume.imp1 = 0;
		resume.totManutenciones = resume.totPernoctas = 0;
		resume.totTransporte = resume.totAc = 0;
	}
	rowCalc(data, resume) {
		resume.imp1 += data.imp1;
		resume.totManutenciones += (data.subtipo == "1") ? data.imp1 : 0;
		resume.totPernoctas += (data.subtipo == "2") ? data.imp1 : 0;
		resume.totTransporte += (data.subtipo == "3") ? data.imp1 : 0;
		resume.totAc += (data.subtipo == "4") ? data.imp1 : 0;
	}
	row(data, resume) {
		const remove = irse.isEditable() ? `<a href="#remove"><i class="fas fa-times action text-red resize"></i></a>` : "";
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº">${resume.count}</td>
			<td data-cell="${i18n.get("lblTipoGasto")}">${i18n.getItem("tiposMultiorganica", data.subtipo)}</td>
			<td data-cell="Orgánica">${data.cod}</td>
			<td data-cell="Económica">${data.nombre}</td>
			<td data-cell="${i18n.get("lblImporte")}">${i18n.isoFloat(data.imp1)} €</td>
			<td data-cell="${i18n.get("lblDesc")}">${data.desc}</td>
			<td data-cell="${i18n.get("lblAcciones")}" class="no-print">${remove}</td>
		</tr>`;
	}
}

export default new IrseOrganicas();
