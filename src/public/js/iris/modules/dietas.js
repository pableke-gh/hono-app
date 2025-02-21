
import tb from "../../components/TemporalBox.js";
import dietas from "../data/dietas/dietas.js";  
import dieta from "../model/Dieta.js";

export default function Dietas(form) {
	const self = this; //self instance
	const perfil = form.get("perfil");
	const rutas = form.get("rutas");
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
			row.imp1 = dietas.getImporte(perfil.getTipo(), pais, 1);
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

	this.init = () => {
		const tblDietas = form.setTable("#manutenciones");
		tblDietas.render(_dietas);
		return self;
	}
}
