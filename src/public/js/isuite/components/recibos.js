
import TableHTML from "../../components/TableHTML.js";
import i18n from "../i18n/langs.js";

export default class Recibos extends TableHTML {
	constructor() {
		super(); // Must call super before 'this'

		// Table default initialization
		this.classList.add("tb-xeco");
		this.tHead = this.createTHead(); // header element
		this.tHead.innerHTML = this.thead(); // set columns
		this.tFoot = this.createTFoot(); // footer element
		this.tFoot.innerHTML = this.tfoot(); // set constents
	}

	thead = () => `<tr>
		<th>Recibo</th><th>F. Operación</th><th>Concepto</th><th>DNI Alumno</th><th>Nombre del Alumno</th>
		<th>Orgánica</th><th>Económica</th><th>Descripción</th><th>Importe</th>
	</tr>`;

	beforeRender(resume) { resume.importe = 0; }
	beforeRow(recibo, resume) { resume.importe += recibo.importe; }
	row = recibo => `<tr class="tb-data">
		<td>${recibo.refreb}</td><td class="text-center">${i18n.isoDate(recibo.fCobro)}</td><td>${recibo.concepto}</td>
		<td>${recibo.dnialu}</td><td>${recibo.nombre}</td><td class="currency">${recibo.org}</td><td class="currency">${recibo.eco}</td>
		<td>${recibo.desc || ""}</td><td class="currency">${i18n.isoFloat(recibo.importe)} €</td>
	</tr>`

	tfoot = () => `<tr>
		<td colspan="7" class="table-refresh" data-refresh="text-render">Recibos: @size;</td>
		<td colspan="2" class="currency table-refresh" data-refresh="text-render">$importe; €</td>
	</tr>`;
}
