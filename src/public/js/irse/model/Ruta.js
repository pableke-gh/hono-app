
import dt from "../../components/types/DateBox.js";

function Ruta() {
	const self = this; //self instance

	this.isPrincipal = ruta => ((ruta.mask & 1) == 1);
	this.setPrincipal = ruta => { ruta.mask |= 1; return self; }
	this.setOrdinaria = ruta => { ruta.mask &= ~1; return self; }

	this.getOrigen = ruta => ruta.origen;
	this.getPaisSalida = ruta => ruta.pais1;
	this.getPaisllegada = ruta => ruta.pais2;
	this.getPaisPernocta = ruta => self.isLlegadaTardia(ruta) ? self.getPaisllegada(ruta) : self.getPaisSalida(ruta);

	this.getHoraSalida = ruta => ruta.dt1;
	this.getHoraLlegada = ruta => ruta.dt2;
	this.salida = ruta => dt.toDate(self.getHoraSalida(ruta)); //tb.parse(self.getHoraSalida(ruta));
	this.llegada = ruta => dt.toDate(self.getHoraLlegada(ruta)); //tb.parse(self.getHoraLlegada(ruta));
}

export default new Ruta();
