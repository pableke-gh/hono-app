
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import valid from "../../i18n/validators.js";

import iris from "../../model/Iris.js";
import rutas from "../../model/ruta/Rutas.js";
import form from "../../../xeco/modules/solicitud.js";

function RutasMun() {
	this.init = () => {
		const elDesp = form.getInput("#desp-mun");
		form.set("is-matricula-mun", () => (elDesp.value == "1"));
		elDesp.onchange = ev => form.refresh(iris);
	}

	this.view = () => {
		form.setData(rutas.getSalida(), ".ui-mun").refresh(iris); // ruta 1
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

	tabs.setAction("paso1", () => fnPaso1());
	tabs.setAction("save1", () => fnPaso1(1));
}

export default new RutasMun();
