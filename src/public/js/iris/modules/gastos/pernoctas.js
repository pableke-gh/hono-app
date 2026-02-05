
import Table from "../../../components/Table.js";
import dt from "../../../components/types/DateBox.js";
import i18n from "../../i18n/langs.js";
import valid from "../../i18n/validators.js";

import iris from "../../model/Iris.js";
import rutas from "../../model/ruta/Rutas.js";
import pernocta from "../../model/gasto/Pernocta.js";
import gastos from "../../model/gasto/Gastos.js";

import perfil from "../perfil/perfil.js";
import pernoctas from "../../data/pernoctas/pernoctas.js";
import form from "../../../xeco/modules/solicitud.js";

class Pernoctas extends Table {
	constructor() {
		super(form.querySelector("#pernoctas"), pernocta.getTable());
	}

	getImporte = () => this.getProp("impMin");
	getNumNoches = () => this.getProp("numNoches");
	getImpNoche = (tipo, pais, dieta) => pernoctas.getImporte(tipo, pais, dieta);
	getPaisNoches = pernocta => (pernocta.desc + ": " + pernocta.num + " noches");
	getPernoctasByPais = () => Map.groupBy(this.getData(), gasto => gasto.desc); // preserve/guarantee order keys
	getTotalNoches = pernoctas => pernoctas.reduce((sum, gasto) => (sum + pernocta.getNumNoches(gasto)), 0); // acumulado de noches
	setPernoctas = () => this.render(gastos.getPernoctas());

	validate = data => {
		valid.gt0("impGasto", data.impGasto)
			.isDate("fMinGasto", data.fMinGasto).isDate("fMaxGasto", data.fMaxGasto);
		if (data.fMinGasto > data.fMaxGasto)
			valid.addError("fMinGasto", "errFechasAloja");
		if (valid.isError()) // error en los campos
			return valid.fail(); // stop validations

		const f2 = new Date(form.valueOf("#fMaxGasto")); // T00:00:00.000Z
		const f1 = new Date(form.valueOf("#fMinGasto")); // T00:00:00.000Z
		data.num = dt.diffDays(f2, f1); // número de noches (fechas truncadas)

		const tipo = perfil.getTipoDieta();
		const grupo = perfil.getGrupoDieta();
		const idPais1 = rutas.getPaisPernocta(f1);
		while (dt.lt(f1, f2)) { // range date iterator
			if (rutas.getPaisPernocta(f1) != idPais1)
				return valid.addError("fMinGasto", "errPais").error();
			f1.addDays(1); // incremento un día
		}
		data.imp2 = this.getImpNoche(tipo, idPais1, grupo);
		data.desc = i18n.getRegion(idPais1);
		return valid.close(data);
	}

	init = () => {
		iris.getImpPernoctas = this.getImporte;
		form.set("is-pernoctas", this.size);
	}
}

export default new Pernoctas();
