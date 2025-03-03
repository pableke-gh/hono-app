
import tb from "../../components/TemporalBox.js";

import iris from "./iris.js";
import perfil from "./perfil.js";
import rutas from "./rutas.js";
import gastos from "./gastos.js";

import dieta from "../model/Dieta.js";
import dietas from "../data/dietas/dietas.js";  

function Dietas() {
	const self = this; //self instance
	const form = iris.getForm(); // form component
	let _tblDietas; // mapa de dietas

	const fnCreateDiaIntermedio = (fecha, tipo, grupo) => {
		const row = dieta.createDiaIntermedio();
		row.pais = rutas.getPaisPernocta(fecha);
		row.imp1 = dietas.getImporte(tipo, pais, grupo);
		fDieta = fDieta.add({ days: 1 });
		return row;
	}
	const fnUpdateDietas = data => {
		gastos.updateDietas(data);
		_tblDietas.render(data);
		return self;
	}
	this.build = () => {
		const temp = []; // mapped array
		if (perfil.isEmpty() || perfil.isRutaUnica() || rutas.isEmpty())
			return fnUpdateDietas(temp); // tabla vacia
		return self;

		const tipo = perfil.getTipoDieta();
		const grupo = perfil.getGrupoDieta();
		let fDieta = tb.trunc(rutas.salida());
		let fMax = tb.trunc(rutas.llegada());

		// primer día
		if (tb.lt(fDieta, fMax) || fDieta.equals(fMax)) {
			const row = dieta.createDiaInicial();
			fDieta = fDieta.add({ days: 1 });
			temp.push(row);
		}

		// primer día intermedio
		if (tb.lt(fDieta, fMax) || fDieta.equals(fMax)) {
			temp.push(fnCreateDiaIntermedio(fDieta, tipo, grupo));
		}

		// resto de días intermedios
		while (tb.lt(fDieta, fMax)) {
			temp.push(fnCreateDiaIntermedio(fDieta, tipo, grupo));
		}

		// ultimo día
		if (fDieta.equals(fMax)) {
			const row = dieta.createDiaFinal();
			temp.push(row);
		}
		return fnUpdateDietas(temp);
	}

	this.init = () => {
		_tblDietas = form.setTable("#manutenciones");
		_tblDietas.setBeforeRender(dieta.beforeRender).setRender(dieta.row).setFooter(dieta.tfoot).render(gastos.getDietas());
		return self;
	}
}

export default new Dietas();
