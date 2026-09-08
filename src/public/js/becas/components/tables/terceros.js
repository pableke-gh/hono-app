
import api from "../../../core/components/Api.js";
import i18n from "../../i18n/langs.js";

import beca from "../../model/Beca.js";
import tercero from "../../model/Tercero.js";

import TableHTML from "../../../core/components/tables/Table.js";
import { getEntidad } from "../../../data/bancos.js";
import paises from "../../data/paises.js";

export default class Terceros extends TableHTML {
	connectedCallback() {
		this.setMsgEmpty("Sin beneficiarios asociados a la solicitud");
		this.set("#view", row => {
			api.init().json("/uae/becas/cuentas?nif=" + row.nif).then(cuentas => {
				document.forms.tercero.load(row, cuentas); // show tercero tab
			});
		});
	}

	findByNif = nif => this.getData().find(row => (row.nif == nif));
	contains = nif => this.getData().some(row => (row.nif == nif));

	beforeRender(resume) {
		resume.importe = 0;
	}

	row(data, i, resume) {
		const estado = tercero.setData(data).getEstado(); // indice de estado
		const cssEstado = [ "text-warn", "text-green", "text-error", "text-warn" ]; // activo = 1, cancelado = 2, nuevo = 3
		const isIbanNuevo = tercero.isIbanNuevo(data.mask) ? "Sí" : "No"; // indicador de si el iban es nuevo o no
		const view = '<a href="#view"><i class="fas fa-search action resize text-blue"></i></a>'; // icono de ver tercero
		const remove = beca.isEditable() ? '<a href="#remove" class="fas fa-times action resize text-red" title="Eliminar beneficiario"></a>' : "";

		resume.importe += data.imp;
		return `<tr class="tb-data">
			<td class="text-center">${resume.count}</td>
			<td><a href="#view">${data.nif}</a></td>
			<td class="${cssEstado[estado]}">${i18n.getItem("descEstados", estado)}</td>
			<td>${tercero.buildName(data)}</td>
			<td>${paises[data.residencia]}</td><td>${data.dir}</td><td>${data.mun || ""}</td><td>${data.cp || ""}</td>
			<td>${data.banco || "-"}</td><td>${data.iban || "-"}</td><td>${data.swift || "-"}</td><td class="text-center">${isIbanNuevo}</td>
			<td class="currency">${i18n.isoFloat(data.imp)} €</td>
			<td class="text-center">${view}${remove}</td>
		</tr>`;
	}

	afterRender(resume) {
		const form = document.forms.beca;
		form.total.setValue(resume.importe);
		form.total.setEditable(this.isEmpty());
		form.btnBeneficiarios.setVisible(this.isEmpty());
	}
}
