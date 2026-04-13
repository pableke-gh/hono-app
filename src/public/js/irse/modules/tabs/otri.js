
import FormBase from "../../../components/forms/FormBase.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";

import otri from "../../model/Otri.js";
import xlsx from "../../../services/xlsx.js";
import { KEYS, TITILES } from "../../data/isu.js";

/*********** Informe ISU par la otri ***********/
class InformeISU extends FormBase {
	constructor() {
		super("xeco-filtro-isu"); // call super before to use this reference
	}

	init() {
		tabs.setInitEvent("listIsu", this.initTab);
	}

	initTab = () => {
		const acOrganicas = this.setAutocomplete("organica-isu", otri.getAutocomplete());
		acOrganicas.setSource(term => api.init().json("/uae/iris/organicas", { term }).then(acOrganicas.render));
	}
}

window.xlsx = (xhr, status, args) => {
    if (!window.showAlerts(xhr, status, args))
        return false; // Server error
    const data = JSON.parse(args.data);

	// XLSX service
	const sheet = "listado-isu";
	const aux = data.map(obj => Object.clone(obj, KEYS));
	xlsx.setData(sheet, aux, otri.xlsx).setTitles(sheet, TITILES);
	xlsx.download("Informe ISU.xlsx"); // download XLSX file
}

export default new InformeISU();
