
import sb from "../../components/types/StringBox.js";
import Tab from "../../core/components/tabs/Tab.js";
import api from "../../core/components/Api.js";

import Organica from "../components/otri/Organica.js";
import Ejercicios from "../../core/components/forms/MultiSelectBox.js";
import Excel from "../components/otri/Excel.js";
import tables from "../components/tables/tables.js";

/*********** Informe ISU par la otri ***********/
export default class OtriTab extends Tab {
	init() {
		const fOtri = document.forms.otri;
		const tOtri = tables.get("tOtri");

		fOtri.ejercicios.setLabels(sb.getEjercicios()).setFirst().render();
		fOtri.addEventListener("submit", ev => {
			fOtri.closeAlerts(); // reset previous alerts
			if (fOtri.organica.validate() && fOtri.isChanged()) { // organica is required
				api.setJSON(fOtri.getData()).json("/uae/iris/isu").then(data => tOtri.render(data));
				fOtri.setChanged(); // reset indicator
			}
			ev.preventDefault(); // ajax call
		});

		tOtri.view();
		super.init();
	}

	afterView() {
		document.forms.otri.organica.focus(); // focus on first input
	}
}

customElements.define("organica-isu", Organica, { extends: "input" });
customElements.define("ej-list", Ejercicios, { extends: "button" });
customElements.define("btn-excel", Excel, { extends: "button" });
