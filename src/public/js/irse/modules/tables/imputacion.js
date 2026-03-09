
import Table from "../../../components/Table.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js";
import organica from "../../model/Organica.js";
import rutas from "../../model/Rutas.js";
import imputacion from "../util/imputacion.js";
import form from "../irse.js"

export default class Imputacion extends Table {
	constructor(form) { // tabla del paso 9 (imputacion)
		super(form.querySelector("#imputacion"));
		this.setMsgEmpty("No existen orgánicas asociadas a la comunicación.");
	}

	init() { // tabla del paso 9
		irse.getImpTotal = this.getImpTotal;
	}

	getImpTransporte = () => this.getProp("totTransporte");
	getImpPernoctas = () => this.getProp("totPernoctas");
	getImpDietas = () => this.getProp("totManutenciones");
	getImpAc = () => this.getProp("totAc");

	getTotTransporte = () => (rutas.getImpKm() + irse.getImpTransporte() + irse.getImpExtraTrans());
	getTotPernoctas = () => (irse.getImpPernoctas() + irse.getImpExtraPernoctas());
	getTotDietas = () => (irse.getImpDietas() + irse.getImpExtraDietas());
	getImpBruto = () => (this.getTotTransporte() + this.getTotPernoctas() + this.getTotDietas() + irse.getTotAc());
	getImpTotal = () => (this.getImpBruto() - irse.getIrpf());

	beforeRender(resume) {
		resume.imp1 = 0;
		resume.totManutenciones = resume.totPernoctas = 0;
		resume.totTransporte = resume.totAc = 0;
	}
	rowCalc(data, resume) {
		resume.imp1 += data.imp1;
		resume.totManutenciones += organica.isDieta(data) ? data.imp1 : 0;
		resume.totPernoctas += organica.isPernocta(data) ? data.imp1 : 0;
		resume.totTransporte += organica.isTransporte(data) ? data.imp1 : 0;
		resume.totAc += organica.isAc(data) ? data.imp1 : 0;
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

	render = () => { // auto-build mono-organica
		const organicas = []; // container
		const org = form.getOrganicas().getFirst();
		const fnAdd = (subtipo, imp) => {
			if (imp < 1) return; // sin importe que asociar al gasto
			const DATA = { tipo: 19, num: org.id, cod: org.o, desc: org.dOrg };
			const gasto = Object.assign({ subtipo }, DATA);
			gasto.nombre = imputacion.get(subtipo, org);
			gasto.imp1 = imp;
			organicas.push(gasto);
		}

		fnAdd(1, this.getTotDietas());
		fnAdd(2, this.getTotPernoctas());
		fnAdd(3, this.getTotTransporte());
		fnAdd(4, irse.getTotAc());
		return super.render(organicas); // super keyword
	}
}
