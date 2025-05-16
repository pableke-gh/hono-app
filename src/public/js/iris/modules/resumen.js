
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

	this.getImpTrans = () => (rvp.getImporte() + transportes.getImporte());
	this.getImpBruto = () => (self.getImpTrans() + pernoctas.getImporte() + dietas.getImporte());

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

	this.setFactComisionado = () => {
		transportes.setTransportes(); // update changes paso 5
		pernoctas.setPernoctas(); // update changes paso 5
	}
	this.setResumen = () => {
		self.setFactComisionado(); // facturas a nombre del comisionado
		dietas.setDietas(); // update table for dietas / manutenciones
	}

	this.init = () => {
		transportes.init();
		pernoctas.init();
		dietas.init();
		iris.getImpBruto = self.getImpBruto;
	}

	this.view = () => {
		self.setResumen(); // update changes from paso 5
		iris.set("matricula", gastos.getMatricula()).set("justifiKm", gastos.getJustifiKm()); // gastos Km
	}

	this.update = () => {
		self.view(); // update changes paso 5
	}
}

export default new Resumen();
