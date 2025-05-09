
import tabs from "../../components/Tabs.js";
import i18n from "../i18n/langs.js";

import iris from "../model/Iris.js";
import gastos from "../model/gasto/Gastos.js"; 

import rvp from "./rutas/rutasVehiculoPropio.js";
import transportes from "./gastos/transportes.js"; 
import pernoctas from "./gastos/pernoctas.js"; 
import dietas from "./gastos/dietas.js";
import gm from "../modules/gastos/gastos.js";
import xeco from "../../xeco/xeco.js";

function Resumen() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component

	const fnSave = data => {
		if (form.isChanged())
			gm.setKm(data).save();
		return true;
	}
	this.validate = data => {
		const valid = i18n.getValidators();
		if (rvp.isJustifiKm())
			valid.size("justifiKm", data.justifiKm, "errJustifiKm");
		return valid.isOk() && fnSave(data);
	}

	tabs.setAction("paso6", () => { form.validate(self.validate) && form.sendTab(window.rcPaso6); });
	tabs.setAction("save6", () => { form.validate(self.validate) && form.sendTab(window.rcSave6, 6); });

	this.setResumen = () => { // update changes paso 5
		transportes.setTransportes(gastos.getTransporte());
		pernoctas.setPernoctas(gastos.getPernoctas());
	}

	this.init = () => {
		transportes.init();
		pernoctas.init();
		dietas.init();

		iris.getImpBruto = () => (rvp.getImporte() + transportes.getImporte() + pernoctas.getImporte() + dietas.getImporte());
	}

	this.view = () => {
		self.setResumen(); // update changes paso 5
		dietas.setDietas(gastos.getDietas());
		iris.set("matricula", gastos.getMatricula()).set("justifiKm", gastos.getJustifiKm()); // gastos Km
	}

	this.update = () => {
		self.view(); // update changes paso 5
	}
}

export default new Resumen();
