
import sb from "../../../components/types/StringBox.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import valid from "../../i18n/validators.js";

import iris from "../../model/Iris.js";
import rutas from "../../model/ruta/Rutas.js";
import gastos from "../../model/gasto/Gastos.js"; 
import form from "../../../xeco/modules/solicitud.js";

function Mun() {
	this.init = () => {
		const elDesp = form.getInput("#desp-mun");
		form.set("is-matricula-mun", () => (elDesp.value == "1"));
		elDesp.onchange = ev => form.refresh(iris);
	}

	this.view = () => {
		const ruta = rutas.getSalida() || { desp: 1 }; // mun = 1 ruta
		ruta.f1 = sb.isoDate(ruta.dt1); // input format date
		ruta.matricula = gastos.getMatricula(); // matricula from gastos
		form.setData(ruta, ".ui-mun").refresh(iris); // mun = 1 ruta
	}

	const fnPaso1 = tab => {
		const data = valid.mun();
		if (!data) // valido el formulario
			return false; // error => no hago nada
		if (!form.isChanged()) // compruebo cambios
			return form.nextTab(tab); // no cambios => salto al siguiente paso
		const temp = Object.assign(iris.getData(), data); // merge data to send
		api.setJSON(temp).json("/uae/iris/save").then(data => form.update(data, tab));
	}

	tabs.setViewEvent(1, this.view);
	tabs.setAction("paso1", () => fnPaso1());
	tabs.setAction("save1", () => fnPaso1(1));
}

export default new Mun();
