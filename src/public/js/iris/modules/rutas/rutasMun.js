
import sb from "../../../components/types/StringBox.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import i18n from "../../i18n/langs.js";

import iris from "../../model/Iris.js";
import ruta from "../../model/ruta/Ruta.js";
import rutas from "../../model/ruta/Rutas.js";
import gastos from "../../model/gasto/Gastos.js";
import form from "../../../xeco/modules/SolicitudForm.js";

function RutasMun() {
	//const self = this; //self instance
	const valid = i18n.getValidators();

	this.init = () => {
		const elDesp = form.getInput("#desp-mun");
		form.set("is-matricula-mun", () => (elDesp.value == "1"));
		elDesp.onchange = ev => form.refresh(iris);
	}

	this.view = () => {
		form.setData(rutas.getSalida(), ".ui-mun").refresh(iris); // ruta 1
	}

	const fnValidateMun = data => {
		valid.size("origen", data.origen, "errOrigen").isDate("dt1", data.dt1); //ha seleccionado un origen
		if (ruta.isVehiculoPropio(data)) { // vehiculo propio
			const msg = "Debe indicar el kilometraje del desplazamiento";
			valid.size20("matricula", data.matricula, "errMatricula").gt0("km1", data.km1, msg);
		}
		if (valid.isError()) // valido mun
			return false; // error en mun
		data.destino = data.origen;
		data.pais1 = data.pais2 = "ES";
		data.dt1 = sb.toIsoDate(data.dt1);
		data.dt2 = sb.endDay(data.dt1);
		data.km2 = data.km1; // km1 = km2
		data.mask = 5; // es cartagena + principal
		return ruta.valid(data); // validate ruta 
	}
	const fnValidate = data => {
		if (!data.memo) // valida textarea
        	valid.addRequired("memo", "errObjeto");
		if (!iris.isMun())
			return valid.isOk();
		const rutaMun = form.validate(fnValidateMun, ".ui-mun");
		if (!rutaMun) // valido el formulario mun
			return false; // error => no hago nada
		data.rutas = [ rutaMun ]; // actualizo las rutas
		const resumen = { size: 1, totKm: rutaMun.km1 };
		resumen.impKm = (rutaMun.km1 * ruta.getImpGasolina());
		resumen.vp = +ruta.isVehiculoPropio(rutaMun);
		data.gastos = gastos.setPaso1(rutaMun, resumen).getGastos(); // actualizo los gastos 
		return rutas.setRutas(data.rutas); // validation = true
	}
	const fnPaso1 = tab => {
		const data = form.validate(fnValidate);
		if (!data) // valido el formulario
			return false; // error => no hago nada
		if (!form.isChanged()) // compruebo cambios
			return form.nextTab(tab); // no cambios => salto al siguiente paso
		const temp = Object.assign(iris.getData(), data); // merge data to send
		api.setJSON(temp).json("/uae/iris/save").then(data => form.update(data, tab));
	}

	tabs.setAction("paso1", () => fnPaso1());
	tabs.setAction("save1", () => fnPaso1(1));
}

export default new RutasMun();
