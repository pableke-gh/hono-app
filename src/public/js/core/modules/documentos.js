
import Table from "../../components/Table.js";
import i18n from "../../i18n/langs.js";

export default class Documentos extends Table {
	constructor(table, opts) {
		super(table, opts); // defautl constructor
		this.setMsgEmpty("No se han encontrado documentos de UXXI-EC asociadas a la solicitud");
	}

	row = data => `<tr class="tb-data">
		<td>${data.num}</td>
		<td>${data.uxxi}</td>
		<td class="currency">${i18n.isoFloat(data.imp) || "-"} €</td>
		<td class="text-center">${i18n.isoDate(data.fUxxi)}</td>
		<td>${data.desc}</td>
		<td class="text-center"><a href="#remove"><i class="fas fa-times action text-red"></i></a></td>
	</tr>`;
}
