
import tb from "../../components/TemporalBox.js";
import ruta from "../model/Ruta.js";

function Rutas() {
	const self = this; //self instance
	let _rutas; // itinerario

	this.setRutas = data => {
		_rutas = data;
		return self;
	}

	this.getPaisSalida = () => ruta.getPaisSalida(_rutas[0]);
	this.salida = () => ruta.salida(_rutas[0]);
	this.llegada = () => ruta.llegada(_rutas.at(-1));
	this.isLlegadaTemprana = () => ruta.isLlegadaTemprana(_rutas.at(-1));

	this.getRuta = fecha => { // Ruta asociada a fecha
		if (!_rutas)
			return null; // itinerario vacio
		let current = rutas[0]; // Ruta de salida
		if (!fecha) return current; // ruta por defecto
		const fMax = fecha.add({ hours: 29 }); // 5h del dia siguiente
		_rutas.forEach(aux => { // rutas ordenadas por fecha
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

	this.render = (tab2, form) => {
		const table = form.setTable("#rutas");
		table.render(_rutas);
		return self;
	}
}

export default new Rutas();
