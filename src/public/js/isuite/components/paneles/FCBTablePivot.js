
import sb from "../../../components/types/StringBox.js";
import TableHTML from "../../../core/components/Table.js";
import i18n from "../../i18n/langs.js";

export default class FCBTablePivot extends TableHTML {
	connectedCallback() {
		this.setMsgEmpty("No se han encontrado resultados asociados a la búsqueda seleccionada");
		this.view(); // show empty message
	}

	beforeRender(resume) {
		resume.enero = resume.febrero = resume.marzo = resume.abril = resume.mayo = resume.junio = 0;
		resume.julio = resume.agosto = resume.septiembre = resume.octubre = resume.noviembre = resume.diciembre = 0;
		resume.total = 0;
	}

	beforeRow(row) {
		const resume = this.getResume();
		resume.enero += row.enero; resume.febrero += row.febrero;
		resume.marzo += row.marzo; resume.abril += row.abril;
		resume.mayo += row.mayo; resume.junio += row.junio;
		resume.julio += row.julio; resume.agosto += row.agosto;
		resume.septiembre += row.septiembre; resume.octubre += row.octubre;
		resume.noviembre += row.noviembre; resume.diciembre += row.diciembre;
		resume.total += row.total;
	}

	row(row) {
		return `<tr class="tb-data">
			<td>${row.grupo}</td>
			<td class="currency">${i18n.isoFloat(row.enero)}</td>
			<td class="currency">${i18n.isoFloat(row.febrero)}</td>
			<td class="currency">${i18n.isoFloat(row.marzo)}</td>
			<td class="currency">${i18n.isoFloat(row.abril)}</td>
			<td class="currency">${i18n.isoFloat(row.mayo)}</td>
			<td class="currency">${i18n.isoFloat(row.junio)}</td>
			<td class="currency">${i18n.isoFloat(row.julio)}</td>
			<td class="currency">${i18n.isoFloat(row.agosto)}</td>
			<td class="currency">${i18n.isoFloat(row.septiembre)}</td>
			<td class="currency">${i18n.isoFloat(row.octubre)}</td>
			<td class="currency">${i18n.isoFloat(row.noviembre)}</td>
			<td class="currency">${i18n.isoFloat(row.diciembre)}</td>
			<td class="currency">${i18n.isoFloat(row.total)}</td>
		</tr>`;
	}

	render(data) {
		// 1 agrupo por grupo de gasto
		const grupos = Object.groupBy(data, row => (row.grupoGasto + " - " + row.grupoGastoDesc));

		// 2. Sumo importes mensuales
		const pivot = Object.entries(grupos).map(([grupo, items]) => {
			const enero = items.reduce((sum, item) => (sum + (sb.getMonth(item.fAsiento) == 1) ? item.impAplicacion : 0), 0);
			const febrero = items.reduce((sum, item) => (sum + (sb.getMonth(item.fAsiento) == 2) ? item.impAplicacion : 0), 0);
			const marzo = items.reduce((sum, item) => (sum + (sb.getMonth(item.fAsiento) == 3) ? item.impAplicacion : 0), 0);
			const abril = items.reduce((sum, item) => (sum + (sb.getMonth(item.fAsiento) == 4) ? item.impAplicacion : 0), 0);
			const mayo = items.reduce((sum, item) => (sum + (sb.getMonth(item.fAsiento) == 5) ? item.impAplicacion : 0), 0);
			const junio = items.reduce((sum, item) => (sum + (sb.getMonth(item.fAsiento) == 6) ? item.impAplicacion : 0), 0);
			const julio = items.reduce((sum, item) => (sum + (sb.getMonth(item.fAsiento) == 7) ? item.impAplicacion : 0), 0);
			const agosto = items.reduce((sum, item) => (sum + (sb.getMonth(item.fAsiento) == 8) ? item.impAplicacion : 0), 0);
			const septiembre = items.reduce((sum, item) => (sum + (sb.getMonth(item.fAsiento) == 9) ? item.impAplicacion : 0), 0);
			const octubre = items.reduce((sum, item) => (sum + (sb.getMonth(item.fAsiento) == 10) ? item.impAplicacion : 0), 0);
			const noviembre = items.reduce((sum, item) => (sum + (sb.getMonth(item.fAsiento) == 11) ? item.impAplicacion : 0), 0);
			const diciembre = items.reduce((sum, item) => (sum + (sb.getMonth(item.fAsiento) == 12) ? item.impAplicacion : 0), 0);
			const total = items.reduce((sum, item) => (sum + item.impAplicacion), 0);

			return {
				grupo,
				enero, febrero, marzo, abril, mayo, junio, 
				julio, agosto, septiembre, octubre, noviembre, diciembre, 
				total
			};
		});

		// 3 render pivot table
		super.render(pivot);
	}

	afterRender() {
		this.tFoot.classList.remove("hide");
	}
}
