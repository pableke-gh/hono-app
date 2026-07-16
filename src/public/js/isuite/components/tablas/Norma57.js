
import api from "../../../core/components/Api.js";
import i18n from "../../i18n/langs.js";
import TableHTML from "../../../core/components/tables/Table.js";

export default class Norma57Table extends TableHTML {
	constructor() {
		super(); // Must call super before 'this'

		// Table default initialization
		this.classList.add("tb-xeco");
		this.tHead = this.createTHead(); // header element
		this.tHead.innerHTML = this.thead(); // set columns
		this.tFoot = this.createTFoot(); // footer element
		this.tFoot.innerHTML = this.tfoot(); // set constents
	}

	beforeRender(resume) {
		resume.importe = 0;
	}

	beforeRow(row) {
		const resume = this.getResume();
		resume.importe += row.importe;
	}

	thead = () => `<tr>
		<th>F. Operación</th>
		<th>Nombre del Plan</th><th>Act.</th><th>Nombre de la Act.</th>
		<th>DNI Alumno</th><th>Nombre del Alumno</th>
		<th>Orgánica</th><th>Económica</th><th>Importe</th>
	</tr>`;
	row(row) {
		return `<tr class="tb-data">
			<td>${i18n.strDate(row.fCobro) ?? ""}</td>
			<td>${row.plan}</td>
			<td>${row.idActividad}</td><td>${row.actNombre}</td>
			<td>${row.dnialu}</td><td>${row.nombre}</td>
			<td>${row.org}</td><td>${row.eco}</td>
			<td class="currency">${i18n.isoFloat(row.importe) || ""}</td>
		</tr>`;
	}
	tfoot = () => `<tr>
		<td colspan="8" class="table-reload" data-reload="text-render">Filas: @size;</td>
		<td class="currency table-reload" data-reload="text-render">$importe;</td>
	</tr>`;
}
