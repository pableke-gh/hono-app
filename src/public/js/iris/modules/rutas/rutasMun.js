
import sb from "../../../components/types/StringBox.js";
import tabs from "../../../components/Tabs.js";
import i18n from "../../i18n/langs.js";

import iris from "../../model/Iris.js";
import ruta from "../../model/ruta/Ruta.js";
import { MUN } from "../../data/rutas.js";

import rmaps from "./rutasMaps.js";
import perfil from "../perfil/perfil.js";
import xeco from "../../../xeco/xeco.js";

function RutasMun() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component

	this.init = () => {
		form.set("is-matricula-mun", globalThis.void);
	}

	this.view = () => {
		const itinerario = rmaps.getRutas();
		const ruta1Dia = Object.assign({}, MUN, itinerario[0]);
		itinerario[0] = ruta1Dia; // Save new data (routes.length = 1)

		form.set("is-matricula-mun", () => ruta.isVehiculoPropio(ruta1Dia));
		const fields = form.getInputs(".ui-mun"); // If any ui-mun input changes => save all rutas
		form.setField(fields[0], ruta1Dia.origen, ev => { ruta1Dia.origen = ruta1Dia.destino = ev.target.value; rmaps.setSaveRutas(); })
			.setField(fields[1], ruta1Dia.desp, ev => { ruta1Dia.desp = +ev.target.value; form.refresh(iris); rmaps.setSaveRutas(); })
			.setField(fields[2], ruta1Dia.km1, ev => { ruta1Dia.km1 = ruta1Dia.km2 = i18n.toFloat(ev.target.value); rmaps.setSaveRutas(); })
			.setField(fields[3], ruta1Dia.dt1, ev => { ruta1Dia.dt1 = ev.target.value; ruta1Dia.dt2 = sb.endDay(ruta1Dia.dt1); rmaps.setSaveRutas(); });
	}

	this.validate = data => {
		const valid = form.getValidators();
		if (!data.memo)
        	valid.addRequired("memo", "errObjeto");
		if (valid.isOk() && perfil.isMun()) // valida ruta unica
			return ruta.valid(rmaps.getRutas()[0]) && rmaps.saveRutas(data);
		return valid.isOk();
	}

	tabs.setAction("paso1", () => { form.validate(self.validate) && form.sendTab(window.rcPaso1); });
	tabs.setAction("save1", () => { form.validate(self.validate) && form.sendTab(window.rcSave1, 1); });
}

export default new RutasMun();
