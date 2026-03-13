
import TableHTML from "../../components/TableHTML.js";
import i18n from "../i18n/langs.js";

import factura from "../model/Factura.js";
import ttpp from "../model/TtppEmpresa.js";
import form from "./factura.js";

export default class Lineas extends TableHTML {
	connectedCallback() {
		this.setMsgEmpty("No existen conceptos asociados a la solicitud");
	}

	addLinea(data) {
		if (!data) return; // error en las validaciones
		this.push(data); // añado la nueva linea
		form.restart("desc").setValue("imp", 0);
	}
	addRecibos = recibos => this.render(recibos.map(ttpp.toLinea));
	addRecibo(recibo) {
		if (recibo && !this.getData().find(linea => ttpp.eq(linea, recibo)))
			this.push(ttpp.toLinea(recibo)); // item to liena
	}

	beforeRender(resume) { resume.imp = 0; }
	beforeRow(data, resume) { resume.imp += data.imp; }
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

	setIva(iva) { // actualizo el iva y el total
		factura.setIva(iva); // set new iva value
		this.afterRender().refreshFooter()
	}
}
