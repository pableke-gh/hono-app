
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

	this.upodate = () => {
		const importe = rvp.getImporte() + transportes.getImporte() + pernoctas.getImporte() + dietas.getImporte();
		form.setText("#imp-bruto", i18n.isoFloat(importe) + " €");
		return self;
	}

	this.view = () => {
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
