
import tb from "../../components/TemporalBox.js";
import dietas from "../../data/irse/dietas/importes.js";  
import dieta from "../../model/irse/Dieta.js";
import rutas from "./rutas.js";

function Dietas() {
	const self = this; //self instance
	let _dietas; // container

	this.setDietas = data => {
		_dietas = data;
		return self;
	}

	this.build = () => {
		_dietas = []; // mapped array
		let fDieta = tb.trunc(rutas.salida());
		let fMax = tb.trunc(rutas.llegada());

		// primer día
		if (tb.lt(fDieta, fMax) || fDieta.equals(fMax)) {
			const row = dieta.createDiaInicial();
			fDieta = fDieta.add({ days: 1 });
			_dietas.push(row);
		}

		// primer día intermedio
		if (tb.lt(fDieta, fMax) || fDieta.equals(fMax)) {
			const row = dieta.createDiaIntermedio();
			fDieta = fDieta.add({ days: 1 });
			_dietas.push(row);
		}

		// resto de días intermedios
		while (tb.lt(fDieta, fMax)) {
			const row = dieta.createDiaIntermedio();
			row.pais = rutas.getPaisPernocta(fDieta);
			row.imp1 = dietas.getImporte(1, pais, 1);
			fDieta = fDieta.add({ days: 1 });
			_dietas.push(row);
		}

		// ultimo día
		if (fDieta.equals(fMax)) {
			const row = dieta.createDiaFinal();
			_dietas.push(row);
		}
		return self;
	}

	this.render = (tab6, form) => {
		const table = form.setTable("#manutenciones");
		table.render(_dietas);
		return self;
	}
}

export default new Dietas();
