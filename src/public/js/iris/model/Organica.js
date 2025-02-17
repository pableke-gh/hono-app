
import coll from "../../components/Collection.js";
import sb from "../../components/StringBox.js";
import i18n from "../../i18n/langs.js";

function Organica() {
	//const self = this; //self instance

	this.getFinanciacion = organicas => {
		let result = "OTR"; //default fin.
		if (coll.isEmpty(organicas))
			return result; // default value
		const ORG_300518 = "300518";
		organicas.forEach(org => {
			result = (sb.starts(org.o, ORG_300518) && ((org.mask & 8) == 8)) ? "ISU" : result; //apli=642
			result = (sb.starts(org.o, ORG_300518) && ((org.mask & 16) == 16) && (result != "ISU")) ? "A83" : result; //apli=643
			result = ((sb.starts(org.o, "300906") || sb.starts(org.o, "300920")) && (result == "OTR")) ? "ACA" : result; //TTPP o Master
		});
		if (organicas.length > 1) {
			if (result == "ISU") return "xSU"; 
			if (result == "A83") return "x83"; 
			if (result == "ACA") return "xAC"; 
			return "xOT";
		}
		return result;
	}

	this.row = row => {
		const editable = window.IRSE.editable;
		const cd = editable ? `<td data-cell="Crédito Disp.">${i18n.isoFloat(row.imp)}</td>` : ""; // #{iris.form.editable}
		const remove = editable ? '<a href="#remove" class="row-action"><i class="fas fa-times action text-red resize"></i></a>' : ""; // #{iris.form.editableP0}
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="#{msg['lbl.organica']}">${row.o}</td>
			${cd}
			<td data-cell="#{msg['lbl.descripcion']}">${row.dOrg}</td>
			<td data-cell="#{msg['lbl.responsable.gasto']}">${row.resp}</td>
			<td data-cell="#{msg['lbl.nombre.apellidos']}">${row.r}</td>
			<td class="no-print" data-cell="Acciones">${remove}</td>
		</tr>`;
	}
    this.tfoot = resume => `<tr><td colspan="99">Filas: ${resume.size}</td></tr>`;
}

export default new Organica();
