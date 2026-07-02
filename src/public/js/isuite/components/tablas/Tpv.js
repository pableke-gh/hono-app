
import api from "../../../core/components/Api.js";
import i18n from "../../i18n/langs.js";
import TableHTML from "../../../core/components/Table.js";

export default class TpvTable extends TableHTML {
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

	thead = () => `<tr><th>Tipo</th><th>F. Operación</th><th>Descripción</th><th>Importe</th></tr>`;
	row(row) {
		return `<tr class="tb-data">
			<td>${row.forma}</td><td>${i18n.strDate(row.fCobro) ?? ""}</td>
			<td>${row.concepto}</td><td class="currency">${i18n.isoFloat(row.importe) || ""}</td>
		</tr>`;
	}
	tfoot = () => `<tr>
		<td colspan="3" class="table-reload" data-reload="text-render">Filas: @size;</td>
		<td class="currency table-reload" data-reload="text-render">$importe;</td>
	</tr>`;
}
