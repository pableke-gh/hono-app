
import dt from "../../components/types/DateBox.js";
import dom from "../lib/dom-box.js";

function Ruta() {
	const self = this; //self instance
	const MIN_DATE = dt.addYears(new Date(), -1); //1 año antes
	const MAX_DATE = dt.addDays(new Date(), 180); //6 meses despues 

	this.isPrincipal = ruta => ((ruta.mask & 1) == 1);
	this.setPrincipal = ruta => { ruta.mask |= 1; return self; }
	this.setOrdinaria = ruta => { ruta.mask &= ~1; return self; }

	this.getOrigen = ruta => ruta.origen;
	this.getPaisSalida = ruta => ruta.pais1;
	this.getPaisllegada = ruta => ruta.pais2;
	this.getPaisPernocta = ruta => {
		return self.isLlegadaTardia(ruta) ? self.getPaisllegada(ruta) : self.getPaisSalida(ruta);
	}

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
	this.validRutas = (r1, r2) => {
		if (!self.valid(r2))
			return false; //stop
		if (!r1.pais2.startsWith(r2.pais1.substring(0, 2)))
			return dom.addError("#destino", "errItinerarioPaises").isOk();
		if (r1.dt2 > r2.dt1) //rutas ordenadas
			dom.addError("#destino", "errItinerarioFechas");
		return dom.isOk();
	}
}

export default new Ruta();
