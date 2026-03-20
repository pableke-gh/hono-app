
import coll from "../../components/CollectionHTML.js";
import dt from "../../components/types/DateBox.js";
import sb from "../../components/types/StringBox.js";
import ruta from "./Ruta.js";

function Rutas() {
	const self = this; //self instance
	let _rutas = []; // itinerario

	this.getRutas = () => _rutas;
	this.size = () => coll.size(_rutas);
	this.isEmpty = () => coll.isEmpty(_rutas);
	this.setRutas = data => { _rutas = data; return self; }

	this.get = i => _rutas[i]; // get by index
	this.getById = id => _rutas.find(ruta => (ruta.id == id)); // get by id
	this.setRuta = (ruta, index) => { _rutas[index || 0] = ruta; return self; }
	this.remove = ruta => _rutas.splice(_rutas.indexOf(ruta), 1);
	this.addRuta = (ruta, dist) => {
		ruta.km1 = ruta.km2 = dist; // set km google
		_rutas.push(ruta); // añado + reordenar por fecha de salida
		_rutas.sort((a, b) => sb.cmp(a.dt1, b.dt1)); // reordenar
	}

	this.getSalida = () => _rutas[0]; // primera ruta
	this.getLlegada = () => _rutas.at(-1); // ultima ruta
	this.getOrigen = () => ruta.getOrigen(self.getSalida()); // origen del itinerario
	this.getDestino = () => ruta.getDestino(self.getLlegada()); // ultimo destino del itinerario
	this.getPrincipal = () => _rutas.find(ruta.isPrincipal); // ruta principal del itinerario
	this.getHoraSalida = () => ruta.getHoraSalida(self.getSalida()); 
	this.getFechaSalida = () => ruta.getFechaSalida(self.getSalida()); 
	this.getPaisSalida = () => ruta.getPaisSalida(self.getSalida());
	this.salida = () => ruta.salida(self.getSalida());
	this.llegada = () => ruta.llegada(self.getLlegada());
	this.getHoraLlegada = () => ruta.getHoraLlegada(self.getLlegada()); 
	this.getFechaLlegada = () => ruta.getFechaLlegada(self.getLlegada()); 

	this.isSalidaTemprana = () => ruta.isSalidaTemprana(self.getSalida());
	this.isSalidaTardia = () => ruta.isSalidaTardia(self.getSalida());
	this.isLlegadaTemprana = () => ruta.isLlegadaTemprana(self.getLlegada());
	this.isLlegadaCena = () => ((self.size() > 0) && ruta.isLlegadaCena(self.getLlegada()));
	this.isMismoDia = () => sb.inDay(self.getHoraSalida(), self.getHoraLlegada());
	this.isMedioDia = () => ruta.isMedioDia(self.getHoraSalida(), self.getHoraLlegada());

	const fnDiffDias = () => dt.diffDays(self.llegada(), dt.trunc(self.salida()));
	this.getNumNoches = () => (self.isEmpty() ? 0 : fnDiffDias());
	this.getNumDias = () => (self.isEmpty() ? 0 : (fnDiffDias() + 1));

	this.getRutasVehiculoPropio = () => _rutas.filter(ruta.isVehiculoPropio);
	this.getNumRutasVp = () => self.getRutasVehiculoPropio().length;
	this.getImpKm = () => (self.getRutasVehiculoPropio().reduce((sum, ruta) => (sum + ruta.km1), 0) * ruta.getImpGasolina());

	this.getRutasPendientes = () => _rutas.filter(ruta.isUnlinked);
	this.getNumRutasPendientes = () => self.getRutasPendientes().length;
	this.unlink = id => _rutas.forEach(data => { ruta.isLinked(data, id) && ruta.setUnlinked(data); });
	this.link = (rutas, gasto) => rutas.forEach(id => ruta.setLinked(self.getById(id), gasto));

	this.getLocomocion = () => coll.unique(_rutas.map(ruta.getMedioTransporte)).join(", ");
	this.getItinerario = () => (self.getOrigen() + _rutas.map(ruta => ruta.destino).join(", "));
	this.getItinerarioVp = () => (self.getRutasVehiculoPropio().map(ruta.getTrayectoPais).join("; "));

	this.getRuta = fecha => { // Ruta asociada a fecha
		if (self.isEmpty())
			return null; // itinerario vacio
		let current = _rutas[0]; // Ruta de salida
		if (!fecha) return current; // ruta por defecto
		const fMax = dt.clone(fecha).addHours(24); // 00h del dia siguiente
		self.getRutas().forEach(aux => { // rutas ordenadas por fecha
			// Ultima fecha de llegada mas proxima a fMax
			current = dt.lt(ruta.llegada(aux), fMax) ? aux : current;
		});
		return current;
	}
	this.getPaisPernocta = fecha => {
		const aux = self.getRuta(fecha);
		if (aux) { // itinerario no vacio
			const f2 = dt.trunc(ruta.llegada(aux)); // fecha de llegada a las 00h
			return dt.lt(fecha, f2) ? ruta.getPaisPernocta(aux) : ruta.getPaisllegada(aux);
		}
		return "ES";
	}

	// recalculo la ruta principal del itinerario
	this.findRutaPrincipal = () => {
		let diff = 0; // diferencia en milisegundos
		let principal = _rutas[0]; // primera ruta
		for (let i = 1; i < _rutas.length; i++) { //itero el itinerario
			const aux = sb.diffDate(_rutas[i].dt1, _rutas[i - 1].dt2);
			if (diff < aux) { // ruta en la que paso mas tiempo
				diff = aux;
				principal = _rutas[i - 1];
			}
		}
		return principal;
	}
	this.setRutaPrincipal = data => {
		_rutas.forEach(ruta.setOrdinaria);
		ruta.setPrincipal(data);
		return self;
	}
}

export default new Rutas();
