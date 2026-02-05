
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

	// tipos de desplazamiento
	this.isVehiculoPropio = ruta => (ruta.desp == 1);
	this.isVehiculoAlquiler = ruta => (ruta.desp == 2);
	this.isVehiculoAjeno = ruta => (ruta.desp == 3);
	this.isTaxiInterurbano = ruta => (ruta.desp == 4);
	this.isDespSinFactura = ruta => (self.isVehiculoPropio(ruta) || self.isVehiculoAjeno(ruta));
	this.isDespConFactura = ruta => !self.isDespSinFactura(ruta); // desplazamiento que requiere factura
	this.isUnlinked = ruta => (self.isLinkable(ruta) && !ruta.g); // rutas asociables a gasto sin gasto asociado
	this.isLinkable = self.isDespConFactura; // rutas a las que se le puede asignar un gasto 
}

export default new Ruta();
