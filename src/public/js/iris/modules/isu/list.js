
import Form from "../../../components/forms/Form.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import i18n from "../../i18n/langs.js";
import xlsx from "../../../services/xlsx.js";

import otri from "../../model/Otri.js";
import ruta from "../../model/ruta/Ruta.js";
import rutas from "../../model/ruta/Rutas.js";
import gasto from "../../model/gasto/Gasto.js";
import gastos from "../../model/gasto/Gastos.js";
import pernocta from "../../model/gasto/Pernocta.js";
import dieta from "../../model/gasto/Dieta.js";
import iris from "../../model/Iris.js";

import formIsu from "./form.js";
import rmaps from "../rutas/rutasMaps.js";
import rvp from "../rutas/rutasVehiculoPropio.js"; 
import pernoctas from "../gastos/pernoctas.js";
import dietas from "../gastos/dietas.js";
import resumen from "../resumen.js";
import xeco from "../../../xeco/xeco.js";

function ListIsu() {
	const form = new Form("#xeco-filtro-isu");
	const tblIsu = form.setTable("#tbl-isu", otri.getTable());

	this.init = () => {
		const acOrganicas = form.setAutocomplete("#organica-isu", otri.getAutocomplete());
		acOrganicas.setSource(term => api.init().json("/uae/iris/organicas", { term }).then(acOrganicas.render));
		tblIsu.render(); // render empty table
	}

	this.view = () => {
	}

	const fnValidate = data => {
		const valid = i18n.getValidators();
		valid.isKey("organica-isu", data.id, "Debe seleccionar una orgánica y al menos un ejercicio para la consulta.");
		return valid.isOk();
	}

	tabs.setInitEvent("formIsu", formIsu.init);
	tabs.setAction("listIsu", () => form.validate(fnValidate) && window.rcListIsu());
	tabs.setAction("excel", () => form.validate(fnValidate) && window.rcExcel());

	window.loadFiltroIsu = (xhr, status, args) => {
		window.showTab(xhr, status, args, "listIsu") && tblIsu.render(JSON.read(args.data));
	}
	window.xlsx = (xhr, status, args) => {
		if (!window.showAlerts(xhr, status, args))
			return false; // Server error
		if (!args.data) // no data loaded
			return !form.showError("No se han encontrado IRIS asociados a la orgánica: " + form.getval("#organica-isu"));

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

		const data = JSON.parse(args.data);
		const formIrse = xeco.getForm().resetCache();
		const aux = data.map(row => {
			iris.setData(row); // current iris
			rmaps.setRutas(JSON.parse(row.rutas));
			gastos.setGastos(JSON.parse(row.gastos));
			resumen.setResumen(); // paso 6 = resumen
			delete row.rutas;
			delete row.gastos;

			row.fact = row.jg;
			//row.int = row.ter; //nombre del interesado puede no coincidir ocn el tercero del JG
			row.vinc = formIrse.getOptionTextByValue('select[name="vinc"]', gastos.getVinc());
			row.gasto = formIrse.getOptionTextByValue('select[name="tipoSubv"]', gastos.getTipoSubv());
			row.proy = gastos.getJustifi();

			const principal = rutas.getPrincipal();
			row.dest = principal.destino;
			row.pais = ruta.getPaisDestino(principal);
			row.itinerario = rutas.getItinerario();
			row.start = rutas.getHoraSalida();
			row.end = rutas.getHoraLlegada();
			row.loc = rutas.getLocomocion();
			row.impLoc = gastos.getTransporte().map(gasto.getDescSubtipoImp).join(", ");
			row.km = rmaps.getTotKm();
			row.vp = rutas.getItinerarioVp();
			row.impKm = rvp.getImporte();

			row.impTrans = resumen.getImpTrans();
			row.noches = row.impNoche = "";
			pernoctas.getPernoctasByPais().forEach((value, key) => {
				const pais = ", " + key; // current name country/region
				row.noches += pais + ": " + pernoctas.getTotalNoches(value) + " noches ";
				row.impNoche += pais + ": " + i18n.isoFloat(pernocta.getImpNoche(value[0])) + " €/noche "; 
			});
			row.noches = row.noches.substring(2);
			row.impNoche = row.impNoche.substring(2);
			row.impPern = pernoctas.getImporte();

			row.dietas = row.impDieta = "";
			dietas.getDietasByPais().forEach((value, key) => { // array de dietas por pais (ES, FR, ...)
				const pais = ", " + dieta.getRegion(value[0] /*key*/); // current name country / region
				row.dietas += pais + ": " + i18n.isoFloat1(dietas.getTotalDias(value)) + " dietas "; // numero de dietas
				row.impDieta += pais + ": " + i18n.isoFloat(dieta.getImpDia(value[0])) + " €/día "; // importe por dieta
			});
			row.dietas = row.dietas.substring(2);
			row.impDieta = row.impDieta.substring(2);
			row.impDietas = dietas.getImporte();
			row.impTotal = resumen.getImpBruto();
			row.taxis = gastos.getGastos().filter(gasto.isTaxiJustifi).map(gasto => gasto.desc).join(", ");
			return keys.map(key => row[key]);
		});

		xlsx.setValues(sheet, aux, otri.xlsx).setTitles(sheet, titles);
		xlsx.download("Informe ISU.xlsx"); // download XLSX file
	}
}

export default new ListIsu();
