
import coll from "../../components/CollectionHTML.js";
import sb from "../../components/StringBox.js";
import tb from "../../components/TemporalBox.js";
import ruta from "../model/Ruta.js";

export default function Rutas(form) {
	const self = this; //self instance
	let _rutas, _tblRutas; // itinerario

	this.isEmpty = () => coll.isEmpty(_rutas);
	this.getPaisSalida = () => ruta.getPaisSalida(_rutas[0]);
	this.salida = () => ruta.salida(_rutas[0]);
	this.llegada = () => ruta.llegada(_rutas.at(-1));
	this.isLlegadaTemprana = () => ruta.isLlegadaTemprana(_rutas.at(-1));

	this.getRutasVeiculoPropio = () => _rutas.filter(ruta.isVehiculoPropio);
	this.getRutasSinGastos = () => _rutas.filter(data => (ruta.isAsociableGasto(data) && !data.g));

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

	const fnSetMain = ruta => {
		_rutas.forEach(ruta => { ruta.mask &= ~1; });
		ruta.mask |= 1;
	}
	this.validate = () => { 
		if (self.isEmpty())
			return dom.closeAlerts().addError("#origen", "errItinerario").isOk();
		let r1 = rutas[0];
		if (!ruta.valid(r1))
			return false;
		for (let i = 1; i < rutas.length; i++) {
			let r2 = rutas[i];
			if (!ruta.valid(r2))
				return false; //stop
			if (!r1.pais2.startsWith(r2.pais1.substring(0, 2)))
				return dom.addError("#destino", "errItinerarioPaises").isOk();
			if (r1.dt2 > r2.dt1) //rutas ordenadas
				return dom.addError("#destino", "errItinerarioFechas").isOk();
			if (rutas[0].origen == r2.origen)
				return dom.addError("#destino", "errMulticomision").isOk();
			r1 = r2; //go next route
		}
		return dom.isOk();
	}
	this.add = (ruta, dist) => {
		ruta.temp = true;
		_rutas.push(ruta);

		//reordeno rutas por fecha de salida
		_rutas.sort((a, b) => sb.cmp(a.dt1, b.dt1));

		//calculo de la ruta principal
		let diff = 0;
		let principal = _rutas[0];
		for (let i = 1; i < _rutas.length; i++) {
			let aux = sb.diffDate(_rutas[i].dt1, _rutas[i - 1].dt2);
			if (diff < aux) {
				diff = aux;
				principal = _rutas[i - 1];
			}
		}

		if (self.validate()) {
			delete ruta.temp;
			fnSetMain(principal);
			ruta.km1 = ruta.km2 = dist;
			window.IRSE.matricula = form.getval("#matricula"); //update from input
			_tblRutas.reload();
		}
		else
			coll.remove(_rutas, ruta => ruta.temp);
		return self;
	}

	this.init = () => {
		_rutas = coll.parse(form.getText("#rutas-data"));
		_tblRutas = form.setTable("#rutas");
		_tblRutas.setMsgEmpty("Aún no has añadido ninguna ETAPA a esta Comunicación.") // #{msg['msg.no.etapas']}
			.setBeforeRender(ruta.beforRender).setRender(ruta.row).setFooter(ruta.tfoot)
			.render(_rutas).setAfterRender(resume => { resume.changed = true; });
		return self;
	}
}
