
import i18n from "../../i18n/langs.js";

function Recibo() {
	const self = this; //self instance

	this.accordion = (data, status) => {
		return `<details>
			<summary>${status.count}. Recibos del ${i18n.isoDate(data.f1)} al ${i18n.isoDate(data.f2)}</summary>
		</details>`;
	}

	this.beforeRender = resume => {
		resume.importe = 0;
	}
	this.rowCalc = (recibo, resume) => {
		resume.importe += recibo.importe;
	}

	this.thead = () => {
		return `<tr>
			<th>Recibo</th><th>F. Operación</th><th>Concepto</th><th>DNI Alumno</th><th>Nombre del Alumno</th>
			<th>Orgánica</th><th>Económica</th><th>Descripción</th><th>Importe</th>
		</tr>`;
	}
	this.row = (recibo, status, resume) => {
		self.rowCalc(recibo, resume);
		return `<tr class="tb-data">
			<td>${recibo.refreb}</td><td class="text-center">${i18n.isoDate(recibo.fCobro)}</td><td>${recibo.concepto}</td>
			<td>${recibo.dnialu}</td><td>${recibo.nombre}</td><td class="currency">${recibo.org}</td><td class="currency">${recibo.eco}</td>
			<td>${recibo.desc || ""}</td><td class="currency">${i18n.isoFloat(recibo.importe)} €</td>
		</tr>`
	}
	this.tfoot = resumen => {
		return `<tr><td colspan="8">Recibos: ${resumen.size}</td><td class="currency">${i18n.isoFloat(resumen.importe)} €</td></tr>`;
	}

	this.getTable = () => ({ beforeRender: self.beforeRender, rowCalc: self.rowCalc, onHeader: self.thead, onRender: self.row, onFooter: self.tfoot });
}

export default new Recibo();
