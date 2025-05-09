
import Form from "../../../components/forms/Form.js";
import tabs from "../../../components/Tabs.js";
import pf from "../../../components/Primefaces.js";
import xlsx from "../../../services/xlsx.js";

import otri from "../../model/Otri.js";
import rutas from "../../model/ruta/Rutas.js";
import gastos from "../../model/gasto/Gastos.js";

import formIsu from "./form.js";
import xeco from "../../../xeco/xeco.js";

function ListIsu() {
	const form = new Form("#xeco-filtro-isu");
	const tblIsu = form.setTable("#tbl-isu", otri.getTable());

	this.init = () => {
		const acOrgancias = form.setAutocomplete("#organica-isu", otri.getAutocomplete());
		acOrgancias.setSource(term => pf.sendTerm("rcFindOrg", term));
		tblIsu.render(); // render empty table
	}

	this.view = () => {
	}

	tabs.setInitEvent("formIsu", formIsu.init);
	tabs.setAction("listIsu", () => window.rcListIsu());
	tabs.setAction("excel", () => window.rcExcel());

	window.loadFiltroIsu = (xhr, status, args) => {
		window.showTab(xhr, status, args, "listIsu") && tblIsu.render(JSON.read(args.data));
	}
	window.xlsx = (xhr, status, args) => {
		if (!window.showAlerts(xhr, status, args))
			return false; // Server error

		// XLSX service
		const sheet = "listado-isu";
		const keys = [ // column order
			"ej", "cod", "jg", "fact", "nif", "ter", "impJg", "fJg", "descJg", 
			"fact", "int", "vinc", "gasto", "proy",
			"dest", "pais", "itinerario", "start", "end", 
			"loc", "impLoc", "km", 
			"vp", "impKm",
			"impTrans", "noches", "impNoche", "impPern", 
			"dietas", "impDieta", 
			"impDietas", "impTotal", "taxis"
		];
		const titles = [ // column names
			"Ej.", "ID", "Nº JG.", "Nº Factura", "NIF Tercero", "Nombre del Tercero", "Imp. Total", "F. Emisión", "Descripción", 
			"Nº de factura/Nº de Justificante (1)", "¿Quién Viaja?", "Vinculación con el proyecto (2)", "Tipo de gasto (3)", "Motivo del gasto (4)",
			"Ciudad a donde viaja", "País a donde viaja", "Itinerario", "Fecha de inicio del viaje (5)", "Fecha de fin del viaje (5)", 
			"Medio de locomoción (6)", "Importe de Locomoción (7)", "Kilómetros recorridos en vehículo particular (en su caso) (8)", 
			"Itinenario Kilómetros recorridos en vehículo particular (en su caso) (9)", "Importe Kilometraje (vehículo particular) (10)",
			"TOTAL Locomoción", "Alojamiento: nº de noches", "Alojamiento: Importe por noche", "TOTAL Alojamiento", 
			"Manutención: nº de días", "Manutención: Importe por día", 
			"TOTAL Manutención", "TOTAL (Locomoción+Alojamiento+Manutención)", "Observaciones (11)"
		];

		const formIrse = xeco.getForm();
		const data = JSON.parse(args.data);
		const aux = data.map(row => {
			rutas.setRutas(JSON.parse(row.rutas));
			gastos.setGastos(JSON.parse(row.gastos));

			row.fact = row.jg;
			row.int = row.ter;
			row.vinc = formIrse.getHtml(`select[name="vinc"]>option[value="${gastos.getVinc()}"]`);
			row.gasto = formIrse.getHtml(`select[name="tipoSubv"]>option[value="${gastos.getTipoSubv()}"]`);
			row.proy = gastos.getJustifi();
console.log('row: ', row);
			return keys.map(key => row[key]);
		});

		xlsx.setValues(sheet, aux, otri.xlsx).setTitles(sheet, titles);
		xlsx.download("Informe ISU.xlsx"); // download XLSX file
	}
}

export default new ListIsu();
