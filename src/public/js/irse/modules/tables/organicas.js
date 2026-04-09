
import TableHTML from "../../../components/TableHTML.js";
import observer from "../../../core/util/Observer.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js";
import organica from "../../model/Organica.js";
import form from "../irse.js"

// tabla de organicas asociadas al perfil (paso 0)
export default class Organicas extends TableHTML {
	#tipo; #financiacion;

	constructor() { // tabla del paso 0 (organicas del perfil)
		super(); // Must call super before 'this'
		this.setMsgConfirm("removeOrg").setMsgEmpty("msgOrganicasEmpty");
		irse.getCreditoDisp = this.getCreditoDisp; // recalcula el credito disp.
		irse.getResponsables = this.getResponsables; // listado de responsables de las organicas
	}

	getTipoDieta = () => this.#tipo;
	isRD = () => (this.#tipo == 1);
	isEUT = () => (this.#tipo == 2);
	isUPCT = () => (this.#tipo == 9);

	getCreditoDisp = () => ((this.isEmpty() || irse.isUxxiec()) ? null : this.getFirst().imp);
	getResponsables = () => (" " + this.getData().map(org => org.r).join(", "));

	isA83 = org => (organica.is643(org) && (this.#financiacion != "ISU")); // A83 = 643 y no ISU
	isACA = org => (organica.isACA(org) && (this.#financiacion == "OTR")); // TTPP o Master
	getFinanciacion = () => this.#financiacion;

	beforeRender() {
		this.#financiacion = "OTR"; //default fin.
	}
	beforeRow(data) {
		this.#tipo = data.tipo; // tipo de organica = (RD, EUT, UPCT)
		this.#financiacion = organica.is642(data) ? "ISU" : this.#financiacion; // apli = 642
		this.#financiacion = this.isA83(data) ? "A83" : this.#financiacion; // A83 = 643 y no ISU
		this.#financiacion = this.isACA(data) ? "ACA" : this.#financiacion; // TTPP o Master
	}
	row(data) {
		const cssP0 = irse.isEditableP0() ? "" : ' class="hide"';
		const remove = irse.isEditableP0() ? `<a href="#remove"${cssP0}><i class="fas fa-times action text-red resize"></i></a>` : "";
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Orgánica">${data.o}</td>
			<td data-cell="Crédito Disp."${cssP0}>${i18n.isoFloat(data.imp)}</td>
			<td data-cell="${i18n.get("lblDesc")}">${data.dOrg}</td>
			<td data-cell="Responsable del gasto">${data.resp}</td>
			<td data-cell="Nombre">${data.r}</td>
			<td class="no-print" data-cell="${i18n.get("lblAcciones")}">${remove}</td>
		</tr>`;
	}
	afterRender() {
		const MULTI_APLICACION = {
			"ISU": "xSU",
			"A83": "x83",
			"ACA": "xAC",
			"OTR": "xOT"
		};
		if (this.size() > 1)
			this.#financiacion = MULTI_APLICACION[this.#financiacion]; // || "xOT"; // default = "xOT"
		form.getPerfil().closeAlerts().stringify("presupuesto", this.getData()); // update input
		observer.emit("perfil", irse); // notify listeners
	}

	autoload = item => {
		if (!irse.isUxxiec())
			this.render([ item ]); // render table 1 item
	}
}
