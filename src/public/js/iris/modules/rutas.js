
import coll from "../../components/CollectionHTML.js";
import tb from "../../components/TemporalBox.js";
import ruta from "../model/Ruta.js";

function Rutas() {
	const self = this; //self instance
	let _rutas; // itinerario

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

	this.init = form => {
		_rutas = coll.parse(form.getText("#rutas-data"));

		const table = form.setTable("#rutas");
		table.setMsgEmpty("Aún no has añadido ninguna ETAPA a esta Comunicación.") // #{msg['msg.no.etapas']}
			.setBeforeRender(ruta.beforRender).setRender(ruta.row).setFooter(ruta.tfoot)
			.render(_rutas).setAfterRender(resume => { resume.changed = true; });
		return self;
	}
}

export default new Rutas();
