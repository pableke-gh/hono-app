
import i18n from "../i18n/langs.js";

function Otri() {
	const self = this; //self instance
	const currency = "#,##0.00";

	this.row = (data, status, resume) => {
		return `<tr class="tb-data">
			<td data-cell="Nº" class="text-center hide-sm">${status.count}</td>
			<td data-cell="ID"><a href="#">${data.cod}</a></td>
			<td data-cell="Nº JG">${data.jg}</td>
			<td data-cell="Nº Factura">${data.fact}</td> 
			<td data-cell="NIF">${data.nif}</td>
			<td data-cell="Tercero">${data.ter}</td>
			<td data-cell="${i18n.get("lblImporte")}" class="currency">${i18n.isoFloat(data.impJg)} €</td>
			<td data-cell="F. Emisión" class="text-center">${i18n.isoDate(data.fJg)}</td>
			<td data-cell="${i18n.get("lblDesc")}" class="hide-sm">${data.descJg}</td>
			<td class="text-center hide-sm"><a href="#"><i class="fas fa-search action resize text-blue"></i></a></td>
		</tr>`;
	}

	this.tfoot = resume => `<tr><td colspan="99">Filas: ${resume.size}</td></tr>`;
	this.getTable = () => ({ onRender: self.row, onFooter: self.tfoot });
	this.getAutocomplete = () => ({ minLength: 4, render: item => item.o + " - " + item.dOrg, select: item => item.o });

	this.xlsx = (worksheet, data, i) => {
		const row = i + 2; // Titles row = 1
		worksheet["G" + row].z = currency; // Imp. Total = currency format
		worksheet["H" + row].t = "d"; // F. Emisión = date format
		worksheet["R" + row].t = "d"; // Fecha de inicio del viaje (5) = date format
		worksheet["S" + row].t = "d"; // Fecha de fin del viaje (5) = date format
		worksheet["V" + row].z = currency; // Kilómetros recorridos en vehículo particular (en su caso) (8) = currency format
		worksheet["X" + row].z = currency; // Importe Kilometraje (vehículo particular) (10) = currency format
		worksheet["Y" + row].z = currency; // TOTAL Locomoción = currency format
		worksheet["AB" + row].z = currency; // TOTAL Alojamiento = currency format
		worksheet["AE" + row].z = currency; // TOTAL Manutención = currency format
		worksheet["AF" + row].z = currency; // TOTAL (Locomoción+Alojamiento+Manutención) = currency format
	}
}

export default new Otri();
