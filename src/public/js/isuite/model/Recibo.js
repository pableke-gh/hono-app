
import i18n from "../i18n/langs.js";

class Recibo {
	accordion = (data, status) => `<details>
		<summary>${status.count}. Recibos del ${i18n.isoDate(data.f1)} al ${i18n.isoDate(data.f2)} (N${data.tipo})</summary>
		<div></div>
	</details>`;

	beforeRender(resume) { resume.importe = 0; }
	rowCalc(recibo, resume) { resume.importe += recibo.importe; }

	thead = () => `<tr>
		<th>Recibo</th><th>F. Operación</th><th>Concepto</th><th>DNI Alumno</th><th>Nombre del Alumno</th>
		<th>Orgánica</th><th>Económica</th><th>Descripción</th><th>Importe</th>
	</tr>`;
	row = recibo => `<tr class="tb-data">
		<td>${recibo.refreb}</td><td class="text-center">${i18n.isoDate(recibo.fCobro)}</td><td>${recibo.concepto}</td>
		<td>${recibo.dnialu}</td><td>${recibo.nombre}</td><td class="currency">${recibo.org}</td><td class="currency">${recibo.eco}</td>
		<td>${recibo.desc || ""}</td><td class="currency">${i18n.isoFloat(recibo.importe)} €</td>
	</tr>`
	tfoot = () => `<tr>
		<td colspan="8" class="table-refresh" data-refresh="text-render">Recibos: @size;</td>
		<td class="currency table-refresh" data-refresh="text-render">$importe; €</td>
	</tr>`;

	getTable = () => ({ beforeRender: this.beforeRender, rowCalc: this.rowCalc, onRender: this.row });
}

export default new Recibo();
