
import sb from "../../../components/types/StringBox.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import valid from "../../i18n/validators/rutas.js";

import irse from "../../model/Irse.js";
import ruta from "../../model/Ruta.js";
import rutas from "../../model/Rutas.js";
import gastos from "../../model/Gastos.js";

import Promotor from "../inputs/Promotor.js";
import perfil from "./perfil.js";
import form from "../irse.js";

/** campo objeto y mun **/
class Paso1 {
	init() {
		// actualiza el desplegable del paso 1 (municipio) y el del paso 2 (rutas)
		form.onChange("[name='desp']", ev => form.setVisible(".grupo-matricula", ruta.isTipoVP(ev.target.value)));
		form.getElement("matriculaMun").addChange(ev => {
			ev.target.value = sb.toUpperWord(ev.target.value);
			irse.setMatricula(ev.target.value);
		});

		tabs.setAction("paso1", () => {
			if (!valid.paso1()) return; // if error => stop
			if (!irse.isEditable() || !form.isChanged())
				return tabs.next(); // go next tab directly
			const promise = perfil.isMun() ? this.saveMun() : this.save();
			promise.then(() => tabs.goTo());
		});
		tabs.setAction("save1", () => {
			if (!valid.paso1()) return; // if error => stop
			if (!form.isChanged()) return form.setOk(); // nada que guardar
			const promise = perfil.isMun() ? this.saveMun() : this.save();
			promise.then(form.setOk);
		});
	}

	#getData = () => { const data = form.getData(".ui-paso1"); data.id = irse.getId(); return data; }
	#update = data => form.setChanged().setFirmas(data.firmas).refresh(irse);

	view(firmas) {
		perfil.isMun() && this.setMun(); // set municipio
		form.setValue("objeto", irse.getMemoria())
			.setValue("grupo-dieta", gastos.getGrupoDieta()).setFirmas(firmas)
			.getElement("promotor").setPromotor(firmas);
	}
	save() { // send data to server and return promise
		return api.setJSON(this.#getData()).json("/uae/iris/paso1/save").then(this.#update);
	}

	getGrupoDieta = () => form.getValue("grupo-dieta");
	isGrupoDieta1 = () => (1 == this.getGrupoDieta());
	setMun() {
		const data = rutas.getSalida() || { desp: 1 }; // mun = 1 ruta
		data.f1 = sb.isoDate(data.dt1); // input format date
		data.matriculaMun = irse.getMatricula(); // matricula from server
		form.setData(data, ".ui-mun").setEditable(irse, ".ui-mun").setVisible(".grupo-matricula", ruta.isVehiculoPropio(data));
	}
	saveMun() {
		const data = this.#getData();
		data.rutas = rutas.getRutas();
		return api.setJSON(data).json("/uae/iris/mun/save").then(this.#update);
	}
}

customElements.define("promotor-input", Promotor, { extends: "input" });

export default new Paso1();
