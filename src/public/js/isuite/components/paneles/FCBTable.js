
import dt from "../../../components/types/DateBox.js";
import tabs from "../../../core/components/helpers/Tabs.js";
import i18n from "../../i18n/langs.js";

import TableHTML from "../../../core/components/Table.js";
import TablePivot from "./FCBTablePivot.js";

export default class FCBTable extends TableHTML {
	connectedCallback() {
		const form = document.forms.isuite;
		form.elements.tabla.addEventListener("click", this.setTableMode);
		form.elements.pivot.addEventListener("click", this.setPivotMode);
		form.setTable(this);

		this.setMsgEmpty("No se han encontrado resultados asociados a la búsqueda seleccionada");
		this.view(); // show empty message
	}

	setTableMode = () => {
		const form = document.forms.isuite;
		form.elements.tabla.hide();
		form.elements.pivot.show();
		this.classList.remove("hide");
		this.nextElementSibling.classList.add("hide");
		tabs.setHeight();
	}
	setPivotMode = () => {
		const form = document.forms.isuite;
		form.elements.tabla.show();
		form.elements.pivot.hide();
		this.classList.add("hide");
		this.nextElementSibling.classList.remove("hide");
		tabs.setHeight();
	}

	getFilename = () => "panel_fcb.xlsx";
	getHeaders = () => this.tHead.querySelectorAll("th").map(th => th.textContent);
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
