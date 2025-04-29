
function Otri() {
	const currency = "#,##0.00";

	this.getAutocomplete = () => ({ minLength: 4, render: item => item.o + " - " + item.dOrg, select: item => item.id });

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
