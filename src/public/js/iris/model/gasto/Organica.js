
import i18n from "../../i18n/langs.js";
import iris from "../Iris.js";

function Pernocatas() {
	const self = this; //self instance

	this.beforeRender = resume => {
		resume.imp1 = 0;
		resume.totDietas = resume.totPernoctas = resume.totTransporte = resume.totAc = 0;
	}

	this.rowCalc = (data, resume) => {
		resume.imp1 += data.imp1; // importe justificado por el usuario en el paso 5
		resume.totDietas += (data.subtipo == 1) ? data.imp1 : 0;
		resume.totPernoctas += (data.subtipo == 2) ? data.imp1 : 0;
		resume.totTransporte += (data.subtipo == 3) ? data.imp1 : 0;
		resume.totAc += (data.subtipo == 4) ? data.imp1 : 0;
	}

	this.row = (data, status, resume) => {
		self.rowCalc(data, resume);
		const remove = iris.isEditable() ? '<a href="#remove" class="row-action"><i class="fas fa-times action text-red resize"></i></a>' : "";
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº">${status.count}</td>
			<td data-cell="${i18n.get("lblTipoGasto")}">${i18n.getItem("tipoOrganica", data.subtipo) || "-"}</td>
			<td data-cell="#{msg['lbl.organica']}">${data.cod}</td>
			<td data-cell="#{msg['lbl.economica']}">${data.nombre}</td>
			<td data-cell="${i18n.get("lblImporte")}">${i18n.isoFloat(data.imp1)} €</td>
			<td data-cell="${i18n.get("lblDesc")}">${data.desc}</td>
			<td data-cell="${i18n.get("lblAcciones")}" class="no-print">${remove}</td>
		</tr>`
	}

	this.tfoot = resume => {
		return `<tr>
			<td colspan="4">Organicas: ${resume.size}</td>
			<td class="tb-data-tc hide-xs">${i18n.isoFloat(resume.imp1)} €</td><td colspan="2"></td>
		</tr>`;
	}

	const msgEmptyTable = "No existen orgánicas asociadas a la comunicación.";
	this.getTable = () => ({ msgEmptyTable, beforeRender: self.beforeRender, rowCalc: self.rowCalc, onRender: self.row, onFooter: self.tfoot });
}

export default new Pernocatas();
