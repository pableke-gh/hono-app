
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";

import iris from "../model/Iris.js";
import gastos from "../model/gasto/Gastos.js"; 

import rmaps from "./rutas/rutasMaps.js";
import rvp from "./rutas/rutasVehiculoPropio.js";
import transportes from "./gastos/transportes.js"; 
import pernoctas from "./gastos/pernoctas.js"; 
import dietas from "./gastos/dietas.js";
import xeco from "../../xeco/xeco.js";

function Resumen() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component

	this.getImpTrans = () => (rmaps.getImporte() + transportes.getImporte());
	this.getImpBruto = () => (self.getImpTrans() + pernoctas.getImporte() + dietas.getImporte() /*+ extras.getImporte()*/); // todo: modulo extras

	this.setFactComisionado = () => {
		transportes.setTransportes(); // update changes paso 5
		pernoctas.setPernoctas(); // update changes paso 5
		xeco.refresh(); // refresh tab 6
	}
	this.setResumen = () => {
		self.setFactComisionado(); // facturas a nombre del comisionado
		dietas.setDietas(); // update table for dietas / manutenciones
	}

	this.init = () => {
		transportes.init();
		pernoctas.init();
		dietas.init();

		iris.getImpTrans = self.getImpTrans;
		iris.getImpBruto = self.getImpBruto;
	}

	this.view = () => {
		self.setResumen(); // update changes from paso 5
		iris.set("matricula", gastos.getMatricula()).set("justifiKm", gastos.getJustifiKm()); // gastos Km
	}

	const fnPasoResumen = tab => {
		const data = form.validate(rvp.validate);
		if (!data) // valido el formulario
			return false; // error => no hago nada
		if (!form.isChanged()) // compruebo cambios
			return form.nextTab(tab); // no cambios => salto al ultimo paso
		const temp = Object.assign(iris.getData(), data); // merge data to send
		temp.gastos = gastos.setKm(data, rmaps.getResume()).getGastos(); // update gastos
		api.setJSON(temp).json("/uae/iris/save").then(data => iris.update(data, tab));
	}

	tabs.setAction("paso6", () => fnPasoResumen());
	tabs.setAction("save6", () => fnPasoResumen("resumen"));

	// download iris-facturas.zip / iris-doc.zip
	tabs.setAction("zip-com", () => api.init().blob("/uae/iris/zip/comisionado", "iris-facturas.zip"));
	tabs.setAction("zip-doc", () => api.init().blob("/uae/iris/zip/documentacion", "iris-doc.zip"));
}

export default new Resumen();
