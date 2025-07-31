
import sb from "../../components/types/StringBox.js";
import i18n from "../i18n/langs.js";
import iris from "./Iris.js";

function Organica() {
	const self = this; //self instance
	const ORG_300518 = "300518"; // organica investigacion
	var _tipo, _financiacion;

	this.getTipoDieta = () => _tipo;
	this.isRD = () => (_tipo == 1);
	this.isEUT = () => (_tipo == 2);
	this.isUPCT = () => (_tipo == 9);

	this.is642 = org => (sb.starts(org.o, ORG_300518) && ((org.mask & 8) == 8));  // apli = 642
	this.is643 = org => (sb.starts(org.o, ORG_300518) && ((org.mask & 16) == 16)); // apli = 643
	this.isA83 = org => (self.is643(org) && (_financiacion != "ISU")); // A83 = 643 y no ISU
	this.isACA = org => ((sb.starts(org.o, "300906") || sb.starts(org.o, "300920")) && (_financiacion == "OTR")); // TTPP o Master
	this.isInve3005 = org => (org && sb.starts(org.o, "3005") && ((org.mask & 64) == 64)); // investigacion de la 3005XX
	this.getFinanciacion = () => _financiacion;

	this.beforeRender = resume => {
		_financiacion = "OTR"; //default fin.
	}

	this.rowCalc = (data, resume) => {
		_tipo = data.tipo; // tipo de organica = (RD, EUT, UPCT)
		_financiacion = self.is642(data) ? "ISU" : _financiacion; // apli = 642
		_financiacion = self.isA83(data) ? "A83" : _financiacion; // A83 = 643 y no ISU
		_financiacion = self.isACA(data) ? "ACA" : _financiacion; // TTPP o Master
	}

	this.row = (data, resume) => {
		self.rowCalc(data, resume);
		const remove = iris.isEditable() ? '<a href="#remove" class="row-action"><i class="fas fa-times action text-red resize"></i></a>' : "";
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="#{msg['lbl.organica']}">${data.o}</td>
			<td data-cell="Crédito Disp." class="form-refresh" data-refresh="is-editable">${i18n.isoFloat(data.imp)}</td>
			<td data-cell="#{msg['lbl.descripcion']}">${data.dOrg}</td>
			<td data-cell="#{msg['lbl.responsable.gasto']}">${data.resp}</td>
			<td data-cell="#{msg['lbl.nombre.apellidos']}">${data.r}</td>
			<td data-cell="Acciones" class="no-print">${remove}</td>
		</tr>`;
	}

	this.tfoot = resume => `<tr><td colspan="99">Filas: ${resume.size}</td></tr>`;

	this.afterRender = resume => {
		const MULTI_APLICACION = {
			"ISU": "xSU",
			"A83": "x83",
			"ACA": "xAC",
			"OTR": "xOT"
		};
		if (resume.size > 1)
			_financiacion = MULTI_APLICACION[_financiacion]; // || "xOT"; // default = "xOT"
		iris.setFinanciacion(_financiacion);
	}

	const msgEmptyTable = "No existen orgánicas asociadas a la comunicación.";
	this.getTable = () => ({ msgEmptyTable, beforeRender: self.beforeRender, rowCalc: self.rowCalc, onRender: self.row, onFooter: self.tfoot });
}

export default new Organica();
