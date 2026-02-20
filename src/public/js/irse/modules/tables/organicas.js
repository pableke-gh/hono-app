
import sb from "../../../components/types/StringBox.js";
import Table from "../../../components/Table.js";
import i18n from "../../i18n/langs.js";
import irse from "../../model/Irse.js";
import form from "../irse.js"

export default class Organicas extends Table {
	constructor(form) { // tabla del paso 0 (organicas del perfil)
		super(form.querySelector("#organicas"), { msgConfirmRemove: "removeOrg" });
		this.setMsgEmpty("No existen orgánicas asociadas a la comunicación.");
		irse.getCreditoDisp = this.getCreditoDisp; // recalcula el credito disp.
		irse.getResponsables = this.getResponsables; // listado de responsables de las organicas
	}

	getCreditoDisp = () => ((this.isEmpty() || irse.isUxxiec()) ? null : this.getFirst().imp);
	getResponsables = () => (" " + this.getData().map(org => org.r).join(", "));
	getFinanciacion() {
		let result = "OTR"; //default fin.
		if (this.isEmpty())
			return result; // default value
		const ORG_300518 = "300518";
		this.getData().forEach(org => {
			result = (sb.starts(org.o, ORG_300518) && ((org.mask & 8) == 8)) ? "ISU" : result; //apli=642
			result = (sb.starts(org.o, ORG_300518) && ((org.mask & 16) == 16) && (result != "ISU")) ? "A83" : result; //apli=643
			result = ((sb.starts(org.o, "300906") || sb.starts(org.o, "300920")) && (result == "OTR")) ? "ACA" : result; //TTPP o Master
		});
		if (this.size() > 1) {
			if (result == "ISU") return "xSU"; 
			if (result == "A83") return "x83"; 
			if (result == "ACA") return "xAC"; 
			return "xOT";
		}
		return result;
	}

	row(data) {
		const remove = irse.isEditableP0() ? '<a href="#remove" class="form-refresh" data-refresh="isEditableP0"><i class="fas fa-times action text-red resize"></i></a>' : "";
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Orgánica">${data.o}</td>
			<td data-cell="Crédito Disp." class="form-refresh" data-refresh="isEditableP0">${i18n.isoFloat(data.imp)}</td>
			<td data-cell="${i18n.get("lblDesc")}">${data.dOrg}</td>
			<td data-cell="Responsable del gasto">${data.resp}</td>
			<td data-cell="Nombre">${data.r}</td>
			<td class="no-print" data-cell="Acciones">${remove}</td>
		</tr>`;
	}

	afterRender() {
		form.getPerfil().closeAlerts().stringify("#presupuesto", this.getData()).update(); // update tab
	}
}
