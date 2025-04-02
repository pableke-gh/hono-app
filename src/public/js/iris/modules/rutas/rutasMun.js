
import tabs from "../../../components/Tabs.js";
import sb from "../../../components/types/StringBox.js";
import i18n from "../../../i18n/langs.js";

import iris from "../iris.js";
import rmaps from "./rutasMaps.js";
import { MUN } from "../../data/rutas.js";

function RutasMun() {
	const self = this; //self instance
	const form = iris.getForm(); // form component

	this.init = () => {
		const itinerario = rmaps.getRutas();
		const SELECTOR = ".grupo-matricula-mun";
		const ruta1Dia = Object.assign({}, MUN, itinerario[0]);
		itinerario[0] = ruta1Dia; // Save new data (routes.length = 1)

		const fields = form.getInputs(".ui-mun");
		form.afterChange(rmaps.setSaveRutas) // Any input change => save all rutas
			.setVisible(SELECTOR, ruta.isVehiculoPropio(ruta1Dia)) // grupo asociado al vehiculo propio
			.setField(fields[0], ruta1Dia.origen, ev => { ruta1Dia.origen = ruta1Dia.destino = ev.target.value; })
			.setField(fields[1], ruta1Dia.desp, ev => { ruta1Dia.desp = +ev.target.value; form.setVisible(SELECTOR, ruta1Dia.desp == 1); })
			.setField(fields[2], i18n.isoFloat(ruta1Dia.km1), ev => { ruta1Dia.km1 = ruta1Dia.km2 = i18n.toFloat(ev.target.value); })
			.setField(fields[3], ruta1Dia.dt1, ev => { ruta1Dia.dt1 = ev.target.value; ruta1Dia.dt2 = sb.endDay(ruta1Dia.dt1); });
	}

	/*********** PERFIL MUN tab-1 ***********/ 
	tabs.setInitEvent(1, self.init);
}

export default new RutasMun();
