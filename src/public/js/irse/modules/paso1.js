
import Tab from "../../core/components/tabs/Tab.js";
import api from "../../core/components/Api.js";
import valid from "../i18n/validators/rutas.js";

import irse from "../model/Irse.js";
import rutas from "../model/Rutas.js";
import form from "./irse.js";

import EquipoGobierno from "../components/paso1/EquipoGobierno.js";
import Promotor from "../components/paso1/Promotor.js";
import Transportes from "../components/paso1/Transportes.js";
import Matricula from "../components/paso1/Matricula.js";
import SavePaso1 from "../components/paso1/SavePaso1.js";

/** campo objeto y mun **/
export default class Paso1 extends Tab {
	afterView() {
		if (irse.isMun())
			form.getElement("despMun").import(rutas.getSalida());
		form.getElement("memo").focus(); // focus on first input
	}

	getGrupoDieta = () => form.getValue("grupo-dieta");
	isGrupoDieta1 = () => form.getElement("grupo-dieta").isGrupoDieta1();

	send() {
		const fnUpdate = data => form.setChanged().setFirmas(data.firmas).refresh(irse);
		const data = form.getData(".ui-paso1");
		data.id = irse.getId();
		if (!irse.isMun())
			return api.setJSON(data).json("/uae/iris/paso1/save").then(fnUpdate);
		data.rutas = rutas.getRutas(); // add rutas json to request
		return api.setJSON(data).json("/uae/iris/mun/save").then(fnUpdate);
	}
	next1() {
		if (!valid.paso1()) return; // if error => stop
		const isMaps = form.getPerfil().isMaps();
		const tab = isMaps ? 2 : (irse.isIsu() ? 3 : 5);
		if (!irse.isEditable() || !form.isChanged())
			return super.show(tab); // go next tab directly
		this.send().then(() => super.show(tab));
	}
}

customElements.define("grupos-dieta-list", EquipoGobierno, { extends: "select" });
customElements.define("promotor-input", Promotor, { extends: "input" });
customElements.define("desp-mun", Transportes, { extends: "select" });
customElements.define("matricula-input", Matricula, { extends: "input" });
customElements.define("save-paso1", SavePaso1, { extends: "button" });
