
import TableHTML from "../../../core/components/tables/Table.js";
import i18n from "../../i18n/langs.js";

export default class Otri extends TableHTML {
	connectedCallback() { // listado isu para la otri
		this.setMsgEmpty("No se han encontrado registros asociadas al filtro seleccionado");
	}

	row(data) {
		return `<tr class="tb-data">
			<td>${data.ej}</td><td>${data.cod}</td>
			<td>${data.jg}</td><td>${data.fact}</td>
			<td>${data.nif}</td><td>${data.ter}</td>
			<td class="currency">${i18n.isoFloat(data.impJg)} €</td>
			<td class="text-center">${i18n.isoDate(data.fJg)}</td>
			<td class="hide-sm">${data.descJg}</td>
			<td class="text-center"></td>
		</tr>`;
	}

	afterRender() {
		document.forms.otri.excel.setVisible(this.size());
	}
}