
import iris from "./iris.js";

import rutas from "./rutas/rutas.js";
import rvp from "./rutas/rutasVehiculoPropio.js";

import gastos from "./gastos/gastos.js"; 
import transportes from "./gastos/transportes.js"; 
import pernoctas from "./gastos/pernoctas.js"; 
import dietas from "./gastos/dietas.js";
import i18n from "../../i18n/langs.js";

function Resumen() {
	const self = this; //self instance
	const form = iris.getForm(); // form component
	let _isUpdatableTab = true; // bool indicator

	this.isUpdatable = () => _isUpdatableTab;
	this.setUpdatable = () => { _isUpdatableTab = true; return self; }

	this.upodate = () => {
		const importe = rvp.getImporte() + transportes.getImporte() + pernoctas.getImporte() + dietas.getImporte();
		form.setText("#imp-bruto", i18n.isoFloat(importe) + " €");
		_isUpdatableTab = false;
		return self;
	}

	this.view = () => {
		if (!_isUpdatableTab)
			return self; // no changes
		rvp.setRutas(rutas.getRutasVeiculoPropio());
		transportes.setTransportes(gastos.getTransporte());
		pernoctas.setPernoctas(gastos.getPernoctas());
		dietas.setDietas(gastos.getDietas());
		return self.upodate();
	}

	this.init = () => {
		rvp.init();
		transportes.init();
		pernoctas.init();
		dietas.init();
		return self;
	}
}

export default new Resumen();
