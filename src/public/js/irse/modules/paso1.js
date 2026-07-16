
import sb from "../../components/types/StringBox.js";
import api from "../../core/components/Api.js";

import irse from "../model/Irse.js";
import ruta from "../model/Ruta.js";
import rutas from "../model/Rutas.js";
import form from "./irse.js";

import EquipoGobierno from "../components/paso1/EquipoGobierno.js";
import Promotor from "../components/paso1/Promotor.js";
import NextPaso1 from "../components/paso1/NextPaso1.js";
import SavePaso1 from "../components/paso1/SavePaso1.js";

/** campo objeto y mun **/
class Paso1 {
	init() { // actualiza el desplegable del paso 1 (municipio) y el del paso 2 (rutas)
		form.onChange("[name='desp']", ev => form.setVisible(".grupo-matricula", ruta.isTipoVP(ev.target.value)));
		form.getElement("matriculaMun").addChange(ev => {
			ev.target.value = sb.toUpperWord(ev.target.value);
			irse.setMatricula(ev.target.value);
		});
	}

	#getData = () => { const data = form.getData(".ui-paso1"); data.id = irse.getId(); return data; }
	#update = data => form.setChanged().setFirmas(data.firmas).refresh(irse);

	view() {
		if (!irse.isMun()) return; // stop
		const data = rutas.getSalida() || { desp: 1 }; // mun = 1 ruta
		data.f1 = sb.isoDate(data.dt1); // input format date
		data.matriculaMun = irse.getMatricula(); // matricula from server
		form.setData(data, ".ui-mun").setEditable(irse, ".ui-mun").setVisible(".grupo-matricula", ruta.isVehiculoPropio(data));
	}
	save() { // send data to server and return promise
		return api.setJSON(this.#getData()).json("/uae/iris/paso1/save").then(this.#update);
	}

	getGrupoDieta = () => form.getValue("grupo-dieta");
	isGrupoDieta1 = () => form.getElement("grupo-dieta").isGrupoDieta1();
	saveMun() {
		const data = this.#getData();
		data.rutas = rutas.getRutas();
		return api.setJSON(data).json("/uae/iris/mun/save").then(this.#update);
	}
}

customElements.define("grupos-dieta-list", EquipoGobierno, { extends: "select" });
customElements.define("promotor-input", Promotor, { extends: "input" });
customElements.define("next-paso1", NextPaso1, { extends: "button" });
customElements.define("save-paso1", SavePaso1, { extends: "button" });

export default new Paso1();
