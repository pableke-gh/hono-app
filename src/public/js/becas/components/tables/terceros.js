
import i18n from "../../i18n/langs.js";
import beca from "../../model/Beca.js";
import tercero from "../../model/Tercero.js";
import paises from "../../data/paises.js";
import TableHTML from "../../../core/components/tables/Table.js";

export default class Terceros extends TableHTML {
	connectedCallback() {
		this.setMsgEmpty("Sin terceros asociados a la solicitud");
	}

	findByNif = nif => this.getData().find(row => (row.nif == nif));
	contains = nif => this.getData().some(row => (row.nif == nif));

	beforeRender(resume) {
		resume.importe = 0;
	}

	row(data, i, resume) {
		const estado = [ "text-green", "text-error", "text-warn" ]; // style css
		const remove = beca.isEditable() ? '<a href="#remove" class="fas fa-times action resize text-red" title="Eliminar beneficiario"></a>' : "";

		resume.importe += data.imp;
		return `<tr class="tb-data">
			<td class="text-center">${resume.count}</td>
			<td>${data.nif}</td>
			<td class="${estado[data.estado]}">${i18n.getItem("descEstados", data.estado)}</td>
			<td>${tercero.buildName(data)}</td>
			<td>${paises[data.residencia]}</td><td>${data.dir}</td><td>${data.mun || ""}</td><td>${data.cp || ""}</td>
			<td>${data.banco || "-"}</td><td>${data.iban || "-"}</td><td>${data.swift || "-"}</td>
			<td class="currency">${i18n.isoFloat(data.imp)} €</td>
			<td class="text-center">${remove}</td>
		</tr>`;
	}

	afterRender() {
		document.forms.beca.elements.btnBeneficiarios.setVisible(this.isEmpty());
	}
}
