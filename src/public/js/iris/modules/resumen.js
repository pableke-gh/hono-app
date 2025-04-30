
import tabs from "../../components/Tabs.js";
import i18n from "../i18n/langs.js";

import iris from "../model/Iris.js";
import gastos from "../model/gasto/Gastos.js"; 

import rvp from "./rutas/rutasVehiculoPropio.js";
import transportes from "./gastos/transportes.js"; 
import pernoctas from "./gastos/pernoctas.js"; 
import dietas from "./gastos/dietas.js";
import send from "./send.js";
import xeco from "../../xeco/xeco.js";

function Resumen() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component

	this.validate = data => {
		//data.totKm = rutas.getTotKm();
console.log(data);
		const valid = i18n.getValidators();
		// todo: validacion de 250 km
		return valid.isOk();
	}

	tabs.setAction("paso6", () => { form.validate(self.validate) && form.sendTab(window.rcPaso6); });
	tabs.setAction("save6", () => { form.validate(self.validate) && form.sendTab(window.rcSave6, 6); });

	this.setResumen = () => { // update changes paso 5
		transportes.setTransportes(gastos.getTransporte());
		pernoctas.setPernoctas(gastos.getPernoctas());
	}

	this.view = () => {
		self.setResumen(); // update changes paso 5
		dietas.setDietas(gastos.getDietas());

		const matricula = gastos.getMatricula();
		form.eachInput(".ui-matricula", el => { el.value = matricula; });
	}

	this.init = () => {
		transportes.init();
		pernoctas.init();
		dietas.init();
		send.init();

		iris.getImpBruto = () => (rvp.getImporte() + transportes.getImporte() + pernoctas.getImporte() + dietas.getImporte());
	}
}

export default new Resumen();
