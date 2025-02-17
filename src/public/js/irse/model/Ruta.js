
import dt from "../../components/DateBox.js";
import dom from "../../lib/uae/dom-box.js";

function Ruta() {
	const MIN_DATE = dt.clone().addDays(-365); //1 año antes
	const MAX_DATE = dt.clone().addDays(180); //6 meses despues

	this.valid = function(ruta) {
		dom.closeAlerts();
		if (!ruta.origen)
			dom.addError("#origen", "errOrigen", "errRequired");
		if (ruta.desp == 1)
			dom.required("#matricula", "errMatricula");
		if (!dt.inRange(new Date(ruta.dt1), MIN_DATE, MAX_DATE))
			return dom.addError("#f1", "errFechasRuta").isOk();
		if (ruta.dt1 > ruta.dt2)
			return dom.addError("#f1", "errFechasOrden").isOk();
		return dom.isOk();
	}
}

export default new Ruta();
