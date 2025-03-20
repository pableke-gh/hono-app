
import coll from "../../../components/CollectionHTML.js";
import tb from "../../../components/types/TemporalBox.js";
import i18n from "../../../i18n/langs.js";
import ruta from "./Ruta.js";

function Rutas() {
	const self = this; //self instance
	let _resumne; // resumen calculado de rutas
	let _rutas; // itinerario

	this.getRutas = () => _rutas;
	this.size = () => coll.size(_rutas);
	this.isEmpty = () => coll.isEmpty(_rutas);
	this.setRutas = data => { _rutas = data; return self; }

	this.setResumen = data => { _resumne = data; return self; }
	this.getImpKm = () => _resumne.impKm;
	this.getKm = () => _resumne.totKm;

	this.getSalida = () => _rutas[0]; // primera ruta
	this.getLlegada = () => _rutas.at(-1); // ultima ruta
	this.getPaisSalida = () => ruta.getPaisSalida(self.getSalida());
	this.salida = () => ruta.salida(self.getSalida());
	this.llegada = () => ruta.llegada(self.getLlegada());
	this.isLlegadaTemprana = () => ruta.isLlegadaTemprana(self.getLlegada());

	const fnDiffDias = () => tb.getDays(tb.trunc(self.salida()), self.llegada());
	this.getNumNoches = () => (self.isEmpty() ? 0 : Math.floor(fnDiffDias()));
	this.getNumDias = () => (self.isEmpty() ? 0 : Math.ceil(fnDiffDias()));

	this.getRutasVehiculoPropio = () => _rutas.filter(ruta.isVehiculoPropio);
	this.getRutasSinGastos = () => _rutas.filter(data => (ruta.isAsociableGasto(data) && !data.g));
	this.getNumRutasSinGastos = () => _rutas.reduce((num, row) => (num + (ruta.isAsociableGasto(row) && !row.g)), 0);

	this.getRuta = fecha => { // Ruta asociada a fecha
		if (rutas.isEmpty())
			return null; // itinerario vacio
		let current = rutas[0]; // Ruta de salida
		if (!fecha) return current; // ruta por defecto
		const fMax = fecha.add({ hours: 29 }); // 5h del dia siguiente
		self.getRutas().forEach(aux => { // rutas ordenadas por fecha
			// Ultima fecha de llegada mas proxima a fMax
			current = tb.lt(ruta.llegada(aux), fMax) ? aux : current;
		});
		return current;
	}
	this.getPaisPernocta = fecha => {
		const aux = self.getRuta(fecha);
		if (aux) { // itinerario no vacio
			const f2 = ruta.llegada(aux); // fecha de llegada
			return tb.lt(fecha, f2) ? ruta.getPaisPernocta(aux) : ruta.getPaisllegada(aux);
		}
		return "ES";
	}

	this.getRutaPrincipal = () => { // calculo la ruta principal del itinerario
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

	this.validate = rutas => {
		rutas = rutas || _rutas;
		const valid = i18n.getValidation();
		if (coll.isEmpty(rutas))
			return !valid.addError("origen", "errItinerario");
		let r1 = rutas[0];
		if (!ruta.valid(r1))
			return false; // salida erronea
		const origen = ruta.getOrigen(r1);
		for (let i = 1; i < rutas.length; i++) {
			const r2 = rutas[i];
			if (!ruta.validRutas(r1, r2))
				return false; //stop
			if (origen == r2.origen)
				return !valid.addError("destino", "errMulticomision");
			r1 = r2; //go next route
		}
		return valid.isOk();
	}
}

export default new Rutas();
