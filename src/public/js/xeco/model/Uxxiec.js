
import i18n from "../../i18n/langs.js";

class Uxxiec {
	row = data => {
		return `<tr class="tb-data">
			<td>${data.num}</td>
			<td>${data.uxxi}</td>
			<td class="currency">${i18n.isoFloat(data.imp) || "-"} €</td>
			<td class="text-center">${i18n.isoDate(data.fUxxi)}</td>
			<td>${data.desc}</td>
			<td class="text-center">
				<a href="#remove"><i class="fas fa-times action text-red"></i></a>
			</td>
		</tr>`;
	}
	getTable = () => ({ msgEmptyTable: "No se han encontrado documentos de UXXI-EC asociadas a la solicitud", onRender: this.row });

	getAutocomplete = () => ({
		minLength: 4, select: item => item.id, 
		render: item => (item.num + " - " + item.uxxi + "<br>" + item.desc)
	});
}

export default new Uxxiec();
