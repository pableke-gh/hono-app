
import sb from "../../components/types/StringBox.js";
import Tab from "../../core/components/tabs/Tab.js";
import Organica from "../components/otri/Organica.js";
import Ejercicios from "../../core/components/forms/MultiSelectBox.js";
import Excel from "../components/otri/Excel.js";

import otri from "../model/Otri.js";
import xlsx from "../services/xlsx.js";
import { KEYS, TITILES } from "../data/isu.js";

/*********** Informe ISU par la otri ***********/
export default class OtriTab extends Tab {
	init() {
		super.init();
		const ejercicios = this.querySelector("ul[name='ejercicios']");
		ejercicios.setLabels(sb.getEjercicios()).setFirst().render();
	}

	afterView() {
		document.forms.otri.elements.orgIsu.focus(); // focus on first input
	}
}

window.xlsx = (xhr, status, args) => {
	const sheet = "listado-isu";
	const data = coll.parse(args.data) || [];
	const aux = data.map(obj => Object.clone(obj, KEYS));
	xlsx.setData(sheet, aux, otri.xlsx).setTitles(sheet, TITILES);
	xlsx.download("Informe ISU.xlsx"); // download XLSX file
}

customElements.define("organica-isu", Organica, { extends: "input" });
customElements.define("ej-list", Ejercicios, { extends: "button" });
customElements.define("btn-excel", Excel, { extends: "button" });
