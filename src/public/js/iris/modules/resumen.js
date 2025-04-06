
import iris from "../model/Iris.js";
import rvp from "./rutas/rutasVehiculoPropio.js";
import gastos from "./gastos/gastos.js"; 
import transportes from "./gastos/transportes.js"; 
import pernoctas from "./gastos/pernoctas.js"; 
import dietas from "./gastos/dietas.js";

function Resumen() {
	const self = this; //self instance
	//const form = xeco.getForm(); // form component
	let _isUpdatableTab = true; // bool indicator

	this.isUpdatable = () => _isUpdatableTab;
	this.setUpdatable = () => { _isUpdatableTab = true; return self; }

	this.view = () => {
		if (!_isUpdatableTab)
			return self; // no changes
		rvp.render();
		transportes.setTransportes(gastos.getTransporte());
		pernoctas.setPernoctas(gastos.getPernoctas());
		dietas.setDietas(gastos.getDietas());
		return self.upodate();
	}

	this.init = () => {
		transportes.init();
		pernoctas.init();
		dietas.init();

		iris.getImpBruto = () => (rvp.getImporte() + transportes.getImporte() + pernoctas.getImporte() + dietas.getImporte());
	}
}

export default new Resumen();
