
import dt from "../../components/types/DateBox.js";

class Ruta {
	isPrincipal = ruta => ((ruta.mask & 1) == 1);
	setPrincipal(ruta) { ruta.mask |= 1; return this; }
	setOrdinaria(ruta) { ruta.mask &= ~1; return this; }

	getOrigen = ruta => ruta.origen;
	getPaisSalida = ruta => ruta.pais1;
	getPaisllegada = ruta => ruta.pais2;
	getPaisPernocta = ruta => this.isLlegadaTardia(ruta) ? this.getPaisllegada(ruta) : this.getPaisSalida(ruta);

	getHoraSalida = ruta => ruta.dt1;
	getHoraLlegada = ruta => ruta.dt2;
	salida = ruta => dt.toDate(this.getHoraSalida(ruta)); //tb.parse(this.getHoraSalida(ruta));
	llegada = ruta => dt.toDate(this.getHoraLlegada(ruta)); //tb.parse(this.getHoraLlegada(ruta));

	// tipos de desplazamiento
	isVehiculoPropio = ruta => (ruta.desp == 1);
	isVehiculoAlquiler = ruta => (ruta.desp == 2);
	isVehiculoAjeno = ruta => (ruta.desp == 3);
	isTaxiInterurbano = ruta => (ruta.desp == 4);
	isDespSinFactura = ruta => (this.isVehiculoPropio(ruta) || this.isVehiculoAjeno(ruta));
	isDespConFactura = ruta => !this.isDespSinFactura(ruta); // desplazamiento que requiere factura
	isUnlinked = ruta => (this.isLinkable(ruta) && !ruta.g); // rutas asociables a gasto sin gasto asociado
	isLinkable = this.isDespConFactura; // rutas a las que se le puede asignar un gasto 

	getImpGasolina = () => .26; // € / kilometro
	getImpKm = ruta => (ruta.km1 * this.getImpGasolina());

	// table renders
	beforeRender = resume => {
		resume.vp = resume.unlinked = 0;
		resume.impKm = resume.totKm = resume.totKmCalc = 0;
	}
	rowCalc = (data, resume) => {
		if (this.isVehiculoPropio(data)) {
			resume.vp++;
			resume.totKm += data.km1;
			resume.totKmCalc += data.km2;
		}
		resume.unlinked += this.isUnlinked(data);
	}
}

export default new Ruta();
