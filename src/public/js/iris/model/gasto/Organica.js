
import i18n from "../../i18n/langs.js";
import iris from "../Iris.js";

class Pernocatas {
	beforeRender = resume => {
		resume.imp1 = 0;
		resume.totDietas = resume.totPernoctas = resume.totTransporte = resume.totAc = 0;
	}

	rowCalc = (data, resume) => {
		resume.imp1 += data.imp1; // importe justificado por el usuario en el paso 5
		resume.totDietas += (data.subtipo == 1) ? data.imp1 : 0;
		resume.totPernoctas += (data.subtipo == 2) ? data.imp1 : 0;
		resume.totTransporte += (data.subtipo == 3) ? data.imp1 : 0;
		resume.totAc += (data.subtipo == 4) ? data.imp1 : 0;
	}

	row(data, resume) {
		const remove = iris.isEditable() ? '<a href="#remove"><i class="fas fa-times action text-red resize"></i></a>' : "";
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº">${resume.count}</td>
			<td data-cell="${i18n.get("lblTipoGasto")}">${i18n.getItem("tipoOrganica", data.subtipo) || "-"}</td>
			<td data-cell="#{msg['lbl.organica']}">${data.cod}</td>
			<td data-cell="#{msg['lbl.economica']}">${data.nombre}</td>
			<td data-cell="${i18n.get("lblImporte")}">${i18n.isoFloat(data.imp1)} €</td>
			<td data-cell="${i18n.get("lblDesc")}">${data.desc}</td>
			<td data-cell="${i18n.get("lblAcciones")}" class="no-print">${remove}</td>
		</tr>`
	}

	getTable = () => ({
		msgEmptyTable: "No existen orgánicas asociadas a la comunicación.",
		beforeRender: this.beforeRender, rowCalc: this.rowCalc, onRender: this.row
	});
}

export default new Pernocatas();
