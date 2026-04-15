
import sb from "../../../components/types/StringBox.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import valid from "../../i18n/validators/rutas.js";

import irse from "../../model/Irse.js";
import rutas from "../../model/Rutas.js";
import perfil from "./perfil.js";
import form from "../irse.js";

/** campo objeto y mun **/
class Paso1 {
	init() {
		// actualiza el desplegable del paso 1 (municipio) y el del paso 2 (rutas)
		form.onChange("[name='desp']", ev => form.setVisible(".grupo-matricula", ev.target.value == "1"));
		form.getElement("matriculaMun").addChange(ev => {
			ev.target.value = sb.toUpperWord(ev.target.value);
			irse.setMatricula(ev.target.value);
		});

		tabs.setViewEvent(1, () => {
			if (perfil.isMun())
				this.setMun();
			this.setPromotor();
		});

		const fnData = () => { const data = form.getData(".ui-paso1"); data.id = irse.getId(); return data; }
		const fnDataMun = () => { const data = fnData(); data.rutas = rutas.getRutas(); return data; }
		const fnUpdate = data => form.setChanged().setFirmas(data.firmas).refresh(irse);

		tabs.setAction("paso1", () => {
			if (!valid.paso1()) return; // if error => stop
			if (!irse.isEditable() || !form.isChanged())
				return tabs.next(); // go next tab directly
			const fnNext = data => { fnUpdate(data); tabs.goTo(); };
			if (perfil.isMun())
				return api.setJSON(fnDataMun()).json("/uae/iris/mun/save").then(fnNext);
			api.setJSON(fnData()).json("/uae/iris/paso1/save").then(fnNext);
		});
		tabs.setAction("save1", () => {
			if (!valid.paso1()) return; // if error => stop
			if (!form.isChanged()) return form.setOk(); // nada que guardar
			const fnNext = data => { fnUpdate(data); form.setOk(); };
			if (perfil.isMun())
				return api.setJSON(fnDataMun()).json("/uae/iris/mun/save").then(fnNext);
			api.setJSON(fnData()).json("/uae/iris/paso1/save").then(fnNext);
		});
	}

	getGrupoDieta = () => form.getValue("grupo-dieta");
	setPromotor() {
		const acPromotor = form.setAutocomplete("promotor");
		const fnPromotor = term => api.init().json("/uae/iris/personal", { id: irse.getId(), term }).then(acPromotor.render);
		acPromotor.setItemMode(4).setSource(fnPromotor);
	}

	setMun() {
		const data = rutas.getSalida() || { desp: 1 }; // mun = 1 ruta
		data.f1 = sb.isoDate(data.dt1); // input format date
		data.matriculaMun = irse.getMatricula(); // matricula from server
		form.setData(data, ".ui-mun").setEditable(irse, ".ui-mun").setVisible(".grupo-matricula", data.desp == 1);
	}
}

export default new Paso1();
