
import Form from "../../components/forms/Form.js";
import tabs from "../../components/Tabs.js";
import dt from "../../components/types/DateBox.js";
import pf from "../../components/Primefaces.js";

import dom from "../../lib/uae/dom-box.js";
import xlsx from "../../services/xlsx.js";

import iris from "./iris.js";
import rutas from "./rutas/rutas.js";

function Otri() {
	const self = this; //self instance
	const form = iris.getForm(); // form component

	this.init = () => {
        const eCong = form.getInput("#congreso"); //congreso si/no
        const eIniCong = form.getInput("#fIniCong"); //fecha inicio del congreso
        const eFinCong = form.getInput("#fFinCong"); //fecha fin del congreso
        const eJustifiCong = form.querySelector(".justifi-congreso"); //justificacion del congreso

        function validCong() {
            let fIniCong = dt.toDate(eIniCong.value);
            let fFinCong = dt.toDate(eFinCong.value);
            dt.addDays(fIniCong, -1).trunc(fIniCong).addDays(fFinCong, 2).trunc(fFinCong);
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
        return self;
    }

	this.validateP3 = function() {
		/*dom.closeAlerts().required("#justifi", "errJustifiSubv");
		if (rutas.getNumRutasVp())
			dom.required("#justifiVp", "errJustifiVp");
		if (eCong.value == "0") // no es congreso
			return dom.isOk() && loading();
		if (validCong()) // valido los datos del congreso
			dom.required("#justifiCong", "errCongreso");
		if (eCong.value == "4")
			dom.required("#impInsc", "errNumber");
		return dom.isOk() && loading();*/
		return true;
	}

	tabs.setAction("paso3", () => { form.validate(self.validateP3) && form.sendTab(window.rcPaso3); });
	tabs.setAction("save3", () => { form.validate(self.validateP3) && form.sendTab(window.rcSave3, 3); });
}

/*********** Listado / FORM ISU ***********/
function fnViewIsu() {
    const formIsu = new Form("#xeco-isu");
    const fnSource = term => pf.sendTerm("rcSolicitudesIrse", term);
    const fnSelect = item => pf.sendId("rcLinkIrse", item.value);
    formIsu.setAcItems("#acIrse", fnSource, fnSelect);
}
window.viewIsu = (xhr, status, args) => {
    showAlerts(xhr, status, args) && fnViewIsu();
}
tabs.setInitEvent(16, () => {
    const formListIsu = new Form("#xeco-filtro-isu");
    const acOrgancias = formListIsu.setAutocomplete("#organica-isu", otri.getAutocomplete());
	acOrgancias.setSource(term => pf.sendTerm("rcFindOrg", term));
});
tabs.setViewEvent(17, fnViewIsu);

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
