
import dt from "../../../components/types/DateBox.js";
import i18n from "../../i18n/langs.js";

import TableHTML from "../../../core/components/Table.js";
import TablePivot from "./FCBTablePivot.js";
import ToggleButton from "./FCBToggle.js";

export default class FCBTable extends TableHTML {
	connectedCallback() {
		this.setMsgEmpty("No se han encontrado resultados asociados a la búsqueda seleccionada");
		this.view(); // show empty message
	}

	getName = () => "panel_fcb";
	getExcel = () => this.getData().map(row => { // map data to excel
		const { grupoGasto, grupoGastoDesc, organica, funcional, economica, organicaDesc, textoLibre, impAplicacion, dc, tipo, fAsiento } = row;
		return {
			grupoGasto, grupoGastoDesc, organica, funcional, economica, 
			organicaDesc, textoLibre, impAplicacion, dc, tipo, 
			fAsiento: dt.toDate(fAsiento)
		};
	});

	beforeRender(resume) {
		resume.impAplicacion = 0;
	}

	beforeRow(row) {
		const resume = this.getResume();
		resume.impAplicacion += row.impAplicacion;
	}

	row(row) {
		return `<tr class="tb-data">
			<td>${row.grupoGasto}</td>
			<td>${row.grupoGastoDesc}</td>
			<td>${row.organica}</td>
			<td>${row.funcional}</td>
			<td>${row.economica}</td>
			<td>${row.organicaDesc}</td>
			<td>${row.textoLibre}</td>
			<td class="currency">${i18n.isoFloat(row.impAplicacion)}</td>
			<td>${row.dc}</td>
			<td>${row.tipo}</td>
			<td>${i18n.isoDate(row.fAsiento)}</td>
		</tr>`;
	}

	render(data) {
		const fnAsc = (a, b) => {
			const cmp = a.grupoGasto.localeCompare(b.grupoGasto);
			return (cmp == 0) ? a.fAsiento.localeCompare(b.fAsiento) : cmp;
		}
		this.nextElementSibling.render(data.sort(fnAsc));
		super.render(data);
	}
}

customElements.define("fcb-pivot", TablePivot, { extends: "table" });
customElements.define("btn-toggle", ToggleButton, { extends: "button" });
