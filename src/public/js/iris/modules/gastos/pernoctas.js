
import tb from "../../../components/types/TemporalBox.js";

import iris from "../../model/Iris.js";
import rutas from "../../model/ruta/Rutas.js";
import pernocta from "../../model/gasto/Pernocta.js";
import gastos from "../../model/gasto/Gastos.js";

import pernoctas from "../../data/pernoctas/pernoctas.js";
import paises from "../../data/paises/paises.js";

import perfil from "../perfil/perfil.js";
import xeco from "../../../xeco/xeco.js";

function Pernoctas() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
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

		const tipo = perfil.getTipoDieta();
		const grupo = perfil.getGrupoDieta();
		/*const f2 = tb.trunc(form.valueOf("#fMaxGasto"));
		let f1 = tb.trunc(form.valueOf("#fMinGasto"));
		const idPais1 = rutas.getPaisPernocta(f1);
		while (tb.lt(f1, f2)) {
			const idPais = rutas.getPaisPernocta(f1);
			if (idPais != idPais1)
				return !valid.addError("#fMinGasto", "errPais");
			f1 = f1.add({ days: 1 });
		}
		data.num = tb.getDays(f1, f2);
		data.imp2 = self.getImpNoche(tipo, idPais1, grupo);
		data.desc = paises.getPais(idPais1);*/
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
