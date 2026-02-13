
import Table from "../../components/Table.js";
import i18n from "../i18n/langs.js";

import factura from "../model/Factura.js";
import form from "./imputacion.js";

class Lineas extends Table {
	constructor() {
		super(form.querySelector("#lineas-fact"));
		this.setMsgEmpty("No existen conceptos asociados a la solicitud");
	}

	addLinea(data) {
		if (!data) return; // error en las validaciones
		this.push(data); // añado la nueva linea
		form.restart("#desc").setValue("#imp", 0);
	}
	addRecibo(recibo) { // solo para ttpp, añado el recibo como linea de la factura
		recibo && this.push({ cod: recibo.value, desc: recibo.label, imp: recibo.imp });
	}

	beforeRender(resume) { resume.imp = 0; }
	rowCalc(data, resume) { resume.imp += data.imp; }
	row(data, resume) {
		const remove = factura.isEditable() ? '<a href="#remove" class="fas fa-times action resize text-red" title="Desasociar partida"></a>' : "";
		return `<tr class="tb-data">
			<td class="text-center">${resume.count}</td>
			<td>${data.desc}</td><td class="currency">${i18n.isoFloat(data.imp)} €</td>
			<td class="text-center">${remove}</td>
		</tr>`;
	}
	afterRender() {
		const resume = this.getResume();
		resume.impIva = resume.imp * (factura.getIva() / 100);
		resume.impTotal = resume.imp + resume.impIva; // total conceptos + importe iva
		return this;
	}
}

export default new Lineas();
