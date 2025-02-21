
import sb from "../../components/StringBox.js";
import { MUN, LOC } from "../data/rutas.js";
import ruta from "../model/Ruta.js";

export default function RutasMun(form) {
	const self = this; //self instance
	const perfil = form.get("perfil");

	this.init = () => {
		const arrRutas = form.get("rutas").getRutas();
		const ruta1Dia = Object.assign({}, perfil.isMun() ? MUN : LOC, arrRutas[0]);
		arrRutas[0] = ruta1Dia; // Save new data (routes.length = 1)

		form.afterChange(ev => { form.set("saveRutas", true); }) // Any input change => save all rutas
			.setVisible(".grupo-matricula", ruta.isVehiculoPropio(ruta1Dia)) // grupo asociado al vehiculo propio
			.setField("#origen", ruta1Dia.origen, ev => { ruta1Dia.origen = ruta1Dia.destino = ev.target.value; })
			.setField("#desp", ruta1Dia.desp, ev => { ruta1Dia.desp = +ev.target.value; })
			.setField("#dist", ruta1Dia.km1, ev => { ruta1Dia.km1 = ruta1Dia.km2 = i18n.toFloat(ev.target.value); })
			.setField("#f2", ruta1Dia.dt2, ev => { ruta1Dia.dt2 = sb.endDay(ev.target.value); })
			.setField("#f1", ruta1Dia.dt1, ev => {
				ruta1Dia.dt1 = ev.target.value;
				//si no hay f2 considero el dia completo de f1 => afecta a las validaciones
				ruta1Dia.dt2 = form.getInput("#f2") ? ruta1Dia.dt2 : sb.endDay(ruta1Dia.dt1);
			});
		return self;
	}
}
