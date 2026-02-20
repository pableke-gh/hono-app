
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
		const rutas = form.getRutas();
		tabs.setInitEvent(1, () => {
			if (form.getPerfil().isMun())
				this.setMun();
			this.setPromotor();
		});
		tabs.setAction("paso1", () => {
			if (!valid.paso1()) return; // if error => stop
			if (!irse.isEditable() || !this.isChanged())
				return tabs.nextTab(); // go next tab directly
			rutas.save(); window.rcPaso1();
		});
		tabs.setAction("save1", () => {
			if (!valid.paso1()) return; // if error => stop
			if (!this.isChanged()) return this.setOk(); // nada que guardar
			rutas.save(); window.rcSave1(); // call server paso1
		});
	}

	setPromotor() {
		const acPromotor = this.setAutocomplete("#promotor");
		const fnPromotor = term => api.init().json("/uae/iris/personal", { id: irse.getId(), term }).then(acPromotor.render);
		acPromotor.setItemMode(4).setSource(fnPromotor);
	}

	setMun() {
		const ruta = rutas.getSalida() || { desp: 1 }; // mun = 1 ruta
		ruta.f1 = sb.isoDate(ruta.dt1); // input format date
		this.setValues(ruta, ".ui-mun").setVisible(".grupo-matricula", ruta.desp == 1)
			.setChangeInput("#desp-mun", ev => this.setVisible(".grupo-matricula", ev.target.value == "1"));
	}
}
