
import tb from "../../../components/types/TemporalBox.js";

import iris from "../../model/Iris.js";
import rutas from "../../model/ruta/Rutas.js";
import gastos from "../../model/gasto/Gastos.js";
import dieta from "../../model/gasto/Dieta.js";

import dietas from "../../data/dietas/dietas.js";  
import perfil from "../perfil/perfil.js";
import xeco from "../../../xeco/xeco.js";

function Dietas() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
	const _tblDietas = form.setTable("#tbl-dietas", dieta.getTable());

	this.getGastos = () => _tblDietas.getData(); // array de gastos
	this.getImporte = () => _tblDietas.getProp("percibir"); // importe total de dietas (imp. a percibir)
	this.getDietasByPais = () => Map.groupBy(_tblDietas.getData(), dieta => dieta.cod); // preserve/guarantee order keys
	this.getTotalDias = dietas => dietas.reduce((sum, gasto) => (sum + dieta.getDieta(gasto)), 0); // acumulado de dias

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

	this.setDietas = () => {
		_tblDietas.render(gastos.getDietas()).setChanged();
	}

	const fnChangeDietas = (dieta, element) => {
		dieta.imp1 = +element.value;
		_tblDietas.refresh();
		form.refresh(iris);
	}

	this.init = () => {
		_tblDietas.setChange("dietas", fnChangeDietas);
		iris.getImpDietas = self.getImporte;
		form.set("is-dietas", _tblDietas.size);
	}
}

export default new Dietas();
