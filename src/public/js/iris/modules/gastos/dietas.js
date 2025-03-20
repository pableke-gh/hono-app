
import tb from "../../../components/types/TemporalBox.js";

import iris from "../iris.js";
import perfil from "../perfil/perfil.js";
import rutas from "../../model/ruta/Rutas.js";
import gastos from "./gastos.js";

import dieta from "../../model/gasto/Dieta.js";
import dietas from "../../data/dietas/dietas.js";  

function Dietas() {
	const self = this; //self instance
	const form = iris.getForm(); // form component
	let _tblDietas; // mapa de dietas

	this.getImporte = () => _tblDietas.getResume().percibir;

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

	this.setDietas = data => {
		_tblDietas.render(data);
		return self;
	}

	const fnAfterDietas = resume => {
		form.setVisible(".block-dietas", resume.size > 0);
	}
	const fnChangeDietas = data => {
		console.log(data);
	}

	this.init = () => {
		_tblDietas = form.setTable("#tbl-dietas");
		_tblDietas.setMsgEmpty("msgDietasEmpty")
				.setBeforeRender(dieta.beforeRender).setRender(dieta.row).setFooter(dieta.tfoot)
				.setAfterRender(fnAfterDietas).setChange("dietas", fnChangeDietas);
		return self;
	}
}

export default new Dietas();
