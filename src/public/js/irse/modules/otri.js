
import dt from "../../components/types/DateBox.js";
import Form from "../../components/forms/Form.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";

import dom from "../lib/dom-box.js";
import xlsx from "../../services/xlsx.js";

import otri from "../model/Otri.js";
import rutas from "./rutas.js";
//import listIsu from "../../iris/modules/isu/list.js";
import sf from "../../xeco/modules/SolicitudForm.js";

function Otri() {
	const form = sf.getForm();

	this.init = () => {
		const eCong = form.getInput("#congreso"); //congreso si/no
		const eIniCong = form.getInput("#fIniCong"); //fecha inicio del congreso
		const eFinCong = form.getInput("#fFinCong"); //fecha fin del congreso
		const eJustifiCong = form.querySelector(".justifi-congreso"); //justificacion del congreso

		function validCong() {
			const fIniCong = dt.trunc(dt.addDays(dt.toDate(eIniCong.value), -1)); // fecha inicio del congreso
			const fFinCong = dt.trunc(dt.addDays(dt.toDate(eFinCong.value), 2)); // fecha fin del congreso
			return ((fIniCong && dt.lt(rutas.start(), fIniCong)) || (fFinCong && dt.lt(fFinCong, rutas.end())));
		}
		function fechasCong() {
			eIniCong.setAttribute("max", eFinCong.value);
			eFinCong.setAttribute("min", eIniCong.value);
			dom.toggleHide(eJustifiCong, !validCong());
		}
		function updateCong() {
			dom.toggleHide(".grp-congreso", eCong.value == "0");
			(+eCong.value > 0) ? fechasCong() : dom.hide(eJustifiCong);
		}

		eIniCong.onblur = fechasCong;
		eFinCong.onblur = fechasCong;
		eCong.onchange = updateCong;
		updateCong();

        window.fnPaso3 = function() {
			dom.closeAlerts().required("#justifi", "errJustifiSubv");
			if (rutas.getNumRutasVp())
				dom.required("#justifiVp", "errJustifiVp");
			if (eCong.value == "0") // no es congreso
				return dom.isOk() && loading();
			if (validCong()) // valido los datos del congreso
				dom.required("#justifiCong", "errCongreso");
			if (eCong.value == "4")
				dom.required("#impInsc", "errNumber");
			return dom.isOk() && loading();
        }
    }
}

/*********** Listado ISU - Justifi OTRI ***********/
//tabs.setInitEvent("listIsu", listIsu.init);
tabs.setInitEvent("listIsu", () => {
    const formListIsu = new Form("#xeco-filtro-isu");
    const acOrganicas = formListIsu.setAutocomplete("#organica-isu", otri.getAutocomplete());
	acOrganicas.setSource(term => api.init().json("/uae/iris/organicas", { term }).then(acOrganicas.render));
});

window.xlsx = (xhr, status, args) => {
    if (!window.showAlerts(xhr, status, args))
        return false; // Server error
    const data = JSON.parse(args.data);

	// XLSX service
	const sheet = "listado-isu";
	const keys = [ // column order
		"ej", "cod", "jg", "fact", "nif", "ter", "impJg", "fJg", "descJg", 
		"jg1", "int", "vinc", "gasto", "proy",
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

	const aux = data.map(obj => Object.clone(obj, keys));
	xlsx.setData(sheet, aux, otri.xlsx).setTitles(sheet, titles);
	xlsx.download("Informe ISU.xlsx"); // download XLSX file
}

export default new Otri();
