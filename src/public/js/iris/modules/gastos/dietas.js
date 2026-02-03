
import Table from "../../../components/Table.js";
import dt from "../../../components/types/DateBox.js";

import iris from "../../model/Iris.js";
import rutas from "../../model/ruta/Rutas.js";
import gastos from "../../model/gasto/Gastos.js";
import dieta from "../../model/gasto/Dieta.js";

import perfil from "../perfil/perfil.js";
import form from "../../../xeco/modules/solicitud.js";

class Dietas extends Table {
	constructor() {
		super(form.querySelector("#tbl-dietas"), dieta.getTable());
	}

	getGastos = gastos.getGastos; // array de gastos
	getDietas = gastos.getDietas; // array de gastos tipo dieta
	setDietas = () => this.render(gastos.getDietas());
	getImporte = () => this.getProp("percibir"); // importe total de dietas (imp. a percibir)
	getDietasByPais = () => Map.groupBy(this.getData(), dieta => dieta.cod); // preserve/guarantee order keys
	getTotalDias = dietas => dietas.reduce((sum, gasto) => (sum + dieta.getDieta(gasto)), 0); // acumulado de dias

	build() {
		gastos.removeByTipo(dieta.getTipo()); // remove gastos de tipo dieta
		if (perfil.isEmpty() || perfil.isRutaUnica() || rutas.isEmpty())
			return super.reset(); // tabla vacia

		const tipo = gastos.getTipoDieta();
		const grupo = gastos.getGrupoDieta();
		const fDieta = dt.trunc(rutas.salida());
		const fMax = dt.trunc(rutas.llegada());

		// añado la nueva dieta a la lista de gastos
		const fnAddDieta = (row, fecha, tipo, grupo) => { gastos.push(dieta.set(row, fecha, tipo, grupo)); return row; }
		const fnCreateDiaIntermedio = (fecha, tipo, grupo) => fnAddDieta(dieta.createDiaIntermedio(), fecha, tipo, grupo);

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
		return super.render(gastos.getDietas());
	}

	init = () => {
		this.setChange("dietas", (dieta, element) => {
			dieta.imp1 = +element.value;
			this.refresh();
			form.refresh(iris);
		});

		iris.getImpDietas = this.getImporte;
		form.set("is-dietas", this.size);
		window.dietas = this; // debug
	}
}

export default new Dietas();
