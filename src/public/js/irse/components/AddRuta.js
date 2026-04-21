
import sb from "../../components/types/StringBox.js";
import valid from "../i18n/validators/rutas.js";
import result from "../../core/util/Result.js";

import maps from "../services/maps.js";
import ruta from "../model/Ruta.js";
import rutas from "../model/Rutas.js";

import place from "../util/place.js";
import form from "../modules/irse.js";

export default class AddRuta extends HTMLAnchorElement {
	async execute() {
		const data = valid.addRuta(); // form data
		if (!data) return false; // invalid inputs

		const origen = form.getInput("#origen"); // ojo! existen 2 campos origen
		const destino = form.getInput("#destino"); // por ahora solo 1 destino!
		var p1 = await origen.getPlace(); // get place with address components
		var p2 = await destino.getPlace(); // get place with address components

		const _setOrigen = (place, pais, mask) => {
			p1 = place;
			data.pais1 = pais;
			data.mask = mask;
		}
		const _addRuta = (ruta, dist) => {
			rutas.addRuta(ruta, dist);
			if (!valid.rutas())
				return rutas.remove(ruta);
			rutas.setRutaPrincipal(rutas.findRutaPrincipal());
			form.getRutas().rebuild(); // render rutas paso 2 = maps
			form.setChanged(true); // update indicator
		}

		if (!p1 && rutas.isEmpty()) // primera ruta
			_setOrigen(place.getPlaceCT(), place.getDefaultCountry(), place.getDefaultMask());
		else if (p1) // ha seleccionado un origen?
			_setOrigen(p1, place.getCountry(p1), place.isCartagena(p1) ? 4 : 0);
		else if (rutas.size() > 0) { //origen = destino anterior
			const last = rutas.getLlegada(); // ultima ruta
			if (!last.p2) // tiene el destino?
				last.p2 = (await result.catch(maps.getPlaces(last.destino))).isOk() ? result.getData()[0] : null;
			_setOrigen(last.p2, last.pais2, last.mask);
		}

		p2 || valid.addRequired("destino", "errDestino"); //ha seleccionado un destino
		p1 || valid.addRequired("origen", "errOrigen"); //ha seleccionado un origen
		if (p1 && p2 && place.isSameLocality(p1, p2)) // is same place?
			valid.addRequired("destino", "errItinerarioCiudad");
		if (valid.isError()) return valid.fail(); // places validator

		data.p2 = p2; // current destination place
		data.dt1 = sb.toIsoDate(data.f1, data.h1);
		data.dt2 = sb.toIsoDate(data.f2, data.h2);
		data.pais2 = place.getCountry(p2);
		data.mask = ((data.mask & 4) && place.isCartagena(p2)) ? 4 : 0;

		if (!valid.ruta(data)) return false; // extra validations
		if (!ruta.isVehiculoPropio(data)) // calculate distance
			return _addRuta(data, null); // no calcula distancia

		await result.catch(maps.getDistance(origen.getLabel(), destino.getLabel()));
		if (result.isError()) return result.error(); // error al calcular la distancia
		_addRuta(data, result.getData()); // distance in km
	}

	connectedCallback() { // init. component
		this.addEventListener("click", ev => { ev.preventDefault(); this.execute(); });
	}
}
