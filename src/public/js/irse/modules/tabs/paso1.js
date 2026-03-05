
import sb from "../../../components/types/StringBox.js";
import Form from "../../../components/forms/Form.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import valid from "../../i18n/validators.js";

import irse from "../../model/Irse.js"
import rutas from "../../model/Rutas.js"
import form from "../irse.js"

/*********** campo objeto y mun ***********/
export default class Paso1 extends Form {
	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init() {
		const perfil = form.getPerfil();
		// actualiza el desplegable del paso 1 (municipio) y el del paso 2 (rutas)
		this.onChange("[name='desp']", ev => this.setVisible(".grupo-matricula", ev.target.value == "1"));
		this.getElement("matriculaMun").addChange(ev => {
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
			if (!irse.isEditable() || !this.isChanged())
				return tabs.nextTab(); // go next tab directly
			if (perfil.isMun())
				return api.setJSON(fnDataMun()).json("/uae/iris/mun/save").then(data => { fnUpdate(data); tabs.goTab(); });
			api.setJSON(fnData()).json("/uae/iris/paso1/save").then(data => { fnUpdate(data); tabs.goTab(); });
		});
		tabs.setAction("save1", () => {
			if (!valid.paso1()) return; // if error => stop
			if (!this.isChanged()) return this.setOk(); // nada que guardar
			if (perfil.isMun())
				return api.setJSON(fnDataMun()).json("/uae/iris/mun/save").then(fnUpdate);
			api.setJSON(fnData()).json("/uae/iris/paso1/save").then(fnUpdate);
		});
	}

	getGrupoDieta = () => form.getValue("grupo-dieta");

	setPromotor() {
		const acPromotor = this.setAutocomplete("#promotor");
		const fnPromotor = term => api.init().json("/uae/iris/personal", { id: irse.getId(), term }).then(acPromotor.render);
		acPromotor.setItemMode(4).setSource(fnPromotor);
	}

	setMun() {
		const ruta = rutas.getSalida() || { desp: 1 }; // mun = 1 ruta
		ruta.f1 = sb.isoDate(ruta.dt1); // input format date
		ruta.matriculaMun = irse.getMatricula(); // matricula from server
		this.setData(ruta, ".ui-mun").setEditable(irse, ".ui-mun").setVisible(".grupo-matricula", ruta.desp == 1);
	}
}
