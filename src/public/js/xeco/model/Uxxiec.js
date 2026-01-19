
import i18n from "../../i18n/langs.js";

function Uxxiec() {
	const self = this; //self instance
	const msgEmptyTable = "No se han encontrado documentos de UXXI-EC asociadas a la solicitud";

	/*let _data; // Current presto data type
	this.getData = () => _data;
	this.get = name => _data[name];
	this.setData = documentos => { _data = documentos; return self; }
	this.set = (name, value) => { _data[name] = value; return self; }*/

	this.row = data => {
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
	this.getTable = () => ({ msgEmptyTable, onRender: self.row });

	const fnRender = item => (item.num + " - " + item.uxxi + "<br>" + item.desc);
	this.getAutocomplete = () => ({ minLength: 4, render: fnRender, select: item => item.id });
}

export default new Uxxiec();
