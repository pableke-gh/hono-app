
import iris from "../model/Iris.js";
import gastos from "../model/gasto/Gastos.js"; 

import rvp from "./rutas/rutasVehiculoPropio.js";
import transportes from "./gastos/transportes.js"; 
import pernoctas from "./gastos/pernoctas.js"; 
import dietas from "./gastos/dietas.js";

function Resumen() {
	//const self = this; //self instance

	this.view = () => {
		transportes.setTransportes(gastos.getTransporte());
		pernoctas.setPernoctas(gastos.getPernoctas());
		dietas.setDietas(gastos.getDietas());
	}

	this.init = () => {
		transportes.init();
		pernoctas.init();
		dietas.init();

		iris.getImpBruto = () => (rvp.getImporte() + transportes.getImporte() + pernoctas.getImporte() + dietas.getImporte());
	}
}

export default new Resumen();
