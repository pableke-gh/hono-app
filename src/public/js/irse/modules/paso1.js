
import sb from "../../components/types/StringBox.js";
import Form from "./form.js";
import tabs from "../../components/Tabs.js";
import valid from "../i18n/validators.js";

import irse from "../model/Irse.js"
import perfil from "./perfil.js";
import rutas from "./rutas.js";

class Paso1 extends Form {
	constructor() {
		super(); // call super before to use this reference

		const fnSave = () => {
			if (perfil.isMun())
				return rutas.save();
			this.setChanged(false);
			return loading();
		}
		tabs.setAction("paso1", () => {
			if (!valid.paso1()) return; // if error => stop
			if (!irse.isEditable() || !this.isChanged())
				return tabs.nextTab(); // go next tab directly
			fnSave(); window.rcPaso1(); // call server paso1
		});
		tabs.setAction("save1", () => {
			if (!valid.paso1()) return; // if error => stop
			if (!this.isChanged()) return this.setOk(); // nada que guardar
			fnSave(); window.rcSave1(); // call server paso1
		});
	}

	mun = () => {
		if (!perfil.isMun()) return;
		const ruta = rutas.first() || { desp: 1 }; // mun = 1 ruta
		ruta.f1 = sb.isoDate(ruta.dt1); // input format date
		this.setValues(ruta, ".ui-mun").setVisible(".grupo-matricula", ruta.desp == 1)
			.setChangeInput("#desp", ev => this.setVisible(".grupo-matricula", ev.target.value == "1"));
	}
}

export default new Paso1();
