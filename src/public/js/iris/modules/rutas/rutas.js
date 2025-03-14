
import coll from "../../../components/CollectionHTML.js";
import sb from "../../../components/types/StringBox.js";
import tb from "../../../components/types/TemporalBox.js";
import i18n from "../../../i18n/langs.js";

import iris from "../iris.js";
import perfil from "../perfil/perfil.js";
import maps from "./maps.js";
import rmaps from "./rutasMaps.js";
import ruta from "../../model/ruta/Ruta.js";

function Rutas() {
	const self = this; //self instance
	const form = iris.getForm(); // form component

	this.size = rmaps.size;
	this.isEmpty = rmaps.isEmpty;
	this.getRutas = rmaps.getRutas;
	this.getSalida = rmaps.getSalida;
	this.getLlegada = rmaps.getLlegada;
	this.getKm = rmaps.getKm;

	this.getRutasVeiculoPropio = rmaps.getRutasVeiculoPropio;
	this.getNumRutasSinGastos = rmaps.getNumRutasSinGastos;
	this.getRutasSinGastos = rmaps.getRutasSinGastos;

	this.getPaisSalida = () => ruta.getPaisSalida(rmaps.getSalida());
	this.salida = () => ruta.salida(rmaps.getSalida());
	this.llegada = () => ruta.llegada(rmaps.getLlegada());
	this.isLlegadaTemprana = () => ruta.isLlegadaTemprana(rmaps.getLlegada());

	const fnDiffDias = () => tb.getDays(tb.trunc(self.salida()), self.llegada());
	this.getNumNoches = () => (self.isEmpty() ? 0 : Math.floor(fnDiffDias()));
	this.getNumDias = () => (self.isEmpty() ? 0 : Math.ceil(fnDiffDias()));

	this.getRuta = fecha => { // Ruta asociada a fecha
		if (rmaps.isEmpty())
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

	this.reload = rutas => { rmaps.reload(rutas); return self; }
	this.setRutas = rutas => { rmaps.setRutas(rutas); return self; }

	function validateItinerario(rutas) {
		const valid = form.getValidators();
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
	this.validateP1 = data => {
		const valid = form.getValidators();
		if (!data.objeto)
        	valid.addRequired("objeto", "errObjeto");
		if (valid.isOk() && perfil.isMun()) // valida la ruta unica
			return validateItinerario(self.getRutas()) && rmaps.saveRutas();
		return valid.isOk();
	}
	this.validate = data => { // validaciones para los mapas
		let ok = self.validateP1(data) && validateItinerario(self.getRutas());
		if (ok && (self.size() < 2)) // validate min rutas = 2
			return !form.getValidators().addRequired("destino", "errMinRutas");
		return ok && rmaps.saveRutas(); // guardo los cambios y recalculo las dietas
	}
	window.validateP1 = () => form.validate(self.validateP1);
	window.validateP2 = () => form.validate(self.validate);

	async function fnAddRuta(ev) {
		ev.preventDefault(); // stop event
		const data = form.validate(maps.validateFields, ".ui-ruta");
		if (!data || !maps.validatePlaces(data, self) || !ruta.valid(data))
			return false; // maps validation error

		const temp = self.getRutas().concat(data);
		// reordeno todas las rutas por fecha de salida
		temp.sort((a, b) => sb.cmp(a.dt1, b.dt1));
		if (!validateItinerario(temp)) // check if all routes are valid
			return false; // no se agrega la nueva ruta
		if (ruta.isVehiculoPropio(data)) { // calcula distancia
			const dist = await maps.getDistance(data.origen, data.destino);
			data.km1 = data.km2 = dist; // actualiza las distancias
			if (!dist || i18n.getValidation().isError())
				return false; // invalid distance
		}

		// nuevo contenedor de rutas + recalculo de la ruta principal
		rmaps.setRutaPrincipal(rmaps.setRutas(temp).getRutaPrincipal());
		return true; // ruta agregada correctamente
	}

	this.maps = () => {
		maps.init();
		form.setClick("#add-ruta", fnAddRuta).setDateRange("#f1", "#f2") // Rango de fechas
			.onChangeInput("#f1", ev => form.setval("#f2", ev.target.value)) // copy value to f2
			.onChangeInput("#desp", ev => form.setVisible(".grupo-matricula", ev.target.value == "1"))
			.onChangeInput("#matricula", ev => { ev.target.value = sb.toUpperWord(ev.target.value); });
		return self;
	}
	this.init = () => {
		rmaps.init();
		return self;
	}
}

export default new Rutas();
