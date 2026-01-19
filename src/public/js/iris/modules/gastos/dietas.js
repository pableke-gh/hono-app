
import dt from "../../../components/types/DateBox.js";

import iris from "../../model/Iris.js";
import rutas from "../../model/ruta/Rutas.js";
import gastos from "../../model/gasto/Gastos.js";
import dieta from "../../model/gasto/Dieta.js";

import perfil from "../perfil/perfil.js";
import sf from "../../../xeco/modules/SolicitudForm.js";

function Dietas() {
	const self = this; //self instance
	const form = sf.getForm(); // form component
	const _tblDietas = form.setTable("#tbl-dietas", dieta.getTable());

	this.getGastos = gastos.getGastos; // array de gastos
	this.getDietas = gastos.getDietas; // array de gastos tipo dieta
	this.isChanged = _tblDietas.isChanged; // la tabla dietas ha cambiado
	this.setChanged = _tblDietas.setChanged; // tabla de dietas actualizada
	this.getImporte = () => _tblDietas.getProp("percibir"); // importe total de dietas (imp. a percibir)
	this.getDietasByPais = () => Map.groupBy(_tblDietas.getData(), dieta => dieta.cod); // preserve/guarantee order keys
	this.getTotalDias = dietas => dietas.reduce((sum, gasto) => (sum + dieta.getDieta(gasto)), 0); // acumulado de dias

	// añado la nueva dieta a la lista de gastos
	const fnAddDieta = (row, fecha, tipo, grupo) => { gastos.push(dieta.set(row, fecha, tipo, grupo)); return row; }
	const fnCreateDiaIntermedio = (fecha, tipo, grupo) => fnAddDieta(dieta.createDiaIntermedio(), fecha, tipo, grupo);
	this.build = () => {
		gastos.removeByTipo(dieta.getTipo()); // remove gastos de tipo dieta
		if (perfil.isEmpty() || perfil.isRutaUnica() || rutas.isEmpty())
			return _tblDietas.reset(); // tabla vacia

		const tipo = gastos.getTipoDieta();
		const grupo = gastos.getGrupoDieta();
		const fDieta = dt.trunc(rutas.salida());
		const fMax = dt.trunc(rutas.llegada());

		// primer día
		if (dt.lt(fDieta, fMax) || dt.inDay(fDieta, fMax)) {
			const row = fnAddDieta(dieta.createDiaInicial(), fDieta, tipo, grupo);
			if (rutas.isMismoDia()) { // rutas de 1 dia
				if (rutas.isMedioDia())
					dieta.setMediaDieta(row);
				else
					dieta.setSinDieta(row);
			}
			else { // rutas de varios dias
				if (rutas.isSalidaTardia())
					dieta.setSinDieta(row);
				else if (!rutas.isSalidaTemprana())
					dieta.setMediaDieta(row);
			}
		}

		// primer día intermedio
		let prev = dt.lt(fDieta, fMax) ? fnCreateDiaIntermedio(fDieta, tipo, grupo) : null;

		// resto de días intermedios
		while (dt.lt(fDieta, fMax)) {
			const pais = rutas.getPaisPernocta(fDieta);
			if (pais == prev.cod) // cambio de país
				dieta.add(prev, fDieta); // añado un día más a la dieta anterior
			else
				prev = fnCreateDiaIntermedio(fDieta, tipo, grupo);
		}

		// ultimo día
		if (dt.inDay(fDieta, fMax)) {
			const row = fnAddDieta(dieta.createDiaFinal(), fDieta, tipo, grupo);
			if (rutas.isLlegadaTemprana())
				dieta.setSinDieta(row);
			else
				dieta.setMediaDieta(row);
		}

		// update table view dietas
		_tblDietas.render(gastos.getDietas());
		return self;
	}
window.dietas = self; // debug

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
