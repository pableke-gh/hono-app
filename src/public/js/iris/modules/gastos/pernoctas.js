
import dt from "../../../components/types/DateBox.js";

import iris from "../../model/Iris.js";
import rutas from "../../model/ruta/Rutas.js";
import pernocta from "../../model/gasto/Pernocta.js";
import gastos from "../../model/gasto/Gastos.js";
import form from "../../../xeco/modules/SolicitudForm.js";

import perfil from "../perfil/perfil.js";
import pernoctas from "../../data/pernoctas/pernoctas.js";
import paises from "../../data/paises/paises.js";

function Pernoctas() {
	const self = this; //self instance
	const _tblPernoctas = form.setTable("#pernoctas", pernocta.getTable());

	//this.getGastos = () => _tblPernoctas.getData(); // array de gastos
	this.getImporte = () => _tblPernoctas.getProp("impMin");
	this.getNumNoches = () => _tblPernoctas.getProp("numNoches");
	this.getImpNoche = (tipo, pais, dieta) => pernoctas.getImporte(tipo, pais, dieta);
	this.getPaisNoches = pernocta => (pernocta.desc + ": " + pernocta.num + " noches");
	this.getPernoctasByPais = () => Map.groupBy(_tblPernoctas.getData(), gasto => gasto.desc); // preserve/guarantee order keys
	this.getTotalNoches = pernoctas => pernoctas.reduce((sum, gasto) => (sum + pernocta.getNumNoches(gasto)), 0); // acumulado de noches

	this.validate = data => {
		const valid = form.getValidators();
		valid.gt0("impGasto", data.impGasto)
			.isDate("fMinGasto", data.fMinGasto).isDate("fMaxGasto", data.fMaxGasto);
		if (data.fMinGasto > data.fMaxGasto)
			valid.addError("fMinGasto", "errFechasAloja");
		if (valid.isError()) // error en los campos
			return false; // stop validations

		const f2 = new Date(form.valueOf("#fMaxGasto")); // T00:00:00.000Z
		const f1 = new Date(form.valueOf("#fMinGasto")); // T00:00:00.000Z
		data.num = dt.diffDays(f2, f1); // número de noches (fechas truncadas)

		const tipo = perfil.getTipoDieta();
		const grupo = perfil.getGrupoDieta();
		const idPais1 = rutas.getPaisPernocta(f1);
		while (dt.lt(f1, f2)) { // range date iterator
			if (rutas.getPaisPernocta(f1) != idPais1)
				return !valid.addError("fMinGasto", "errPais");
			f1.addDays(1); // incremento un día
		}
		data.imp2 = self.getImpNoche(tipo, idPais1, grupo);
		data.desc = paises.getRegion(idPais1);
		return valid.isOk();
	}

	this.setPernoctas = () => {
		_tblPernoctas.render(gastos.getPernoctas());
	}

	this.init = () => {
		iris.getImpPernoctas = self.getImporte;
		form.set("is-pernoctas", _tblPernoctas.size);
	}
}

export default new Pernoctas();
