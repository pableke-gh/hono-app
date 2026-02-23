
import dt from "../../components/types/DateBox.js";
import sb from "../../components/types/StringBox.js";

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

	isLinkable = this.isDespConFactura; // rutas a las que se le puede asignar un gasto 
	isUnlinked = ruta => (this.isLinkable(ruta) && !ruta.g); // rutas asociables a gasto sin gasto asociado
	setUnlinked(ruta) { delete ruta.g; return this; } // desvincular o marcar como vinculado sin gasto asociado
	isLinked = (ruta, id) => (ruta.g == id); // ruta con gasto asociado
	setLinked(ruta, id) { ruta.g = id; } // asocia la ruta al gasto

	isSalidaTemprana = ruta => (sb.getHours(ruta.dt1) < 14);
	isSalidaTardia = ruta => (sb.getHours(ruta.dt1) > 21);
	isLlegadaTemprana = ruta => (sb.getHours(ruta.dt2) < 14);
	isLlegadaTardia = ruta => (sb.getHours(ruta.dt2) < 5);
	isLlegadaCena = ruta => (sb.getHours(ruta.dt2) > 21);
	isMismoDia = ruta => sb.inDay(ruta.dt1, ruta.dt2);
	isMedioDia(dt1, dt2) {
		const h1 = sb.getHours(dt1);
		const h2 = sb.getHours(dt2);
		return sb.inDay(dt1, dt2) && (h1 < 14) && (h2 > 15) && ((h2 - h1) >= 5); //14:00 a 15:59h
	}

	getImpGasolina = () => .26; // € / kilometro
	getImpKm = ruta => (ruta.km1 * this.getImpGasolina());

	// table calculators
	beforeRender = resume => {
		resume.vp = resume.impKm = resume.totKm = resume.totKmCalc = 0;
	}
	rowCalc = (data, resume) => {
		if (this.isVehiculoPropio(data)) {
			resume.vp++;
			resume.totKm += data.km1;
			resume.totKmCalc += data.km2;
		}
	}
}

export default new Ruta();
