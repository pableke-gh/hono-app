
import coll from "../../components/CollectionHTML.js";
import sb from "../../components/StringBox.js";
import i18n from "../../i18n/langs.js";
import place from "./place.js";

/**
 * TRAVEL_MODE: Used for driving directions, this mode provides driving directions.
 * ej: https://developers.google.com/maps/documentation/javascript/examples/directions-travel-modes
 * 
 * DRIVING: Used for passenger cars, this mode provides driving directions.
 * WALKING: Used for pedestrians, this mode provides walking directions.
 * BICYCLING: Used for motorized two-wheelers, this mode provides bicycling directions.
 * TRANSIT: Used for public transportation, this mode provides transit directions, including bus, train, and subway routes.
 * There is no FLIGHT travel mode in the Google Maps Javascript API v3.
*/
const DRIVING = "DRIVING";
//const TRAVEL_MODE = [DRIVING, "WALKING", "BICYCLING", "TRANSIT"];
//const TRAVEL_TYPE = ["Vehículo Propio", "Vehículo Alquiler", "Vehículo Ajeno", "Taxi Interurbano", "Bús Interurbano", "Tren", "Barco", "Avión", "Otros", "Transportes Públicos"]
//const DRIVING_TYPE = ["1", "2", "3", "4"];

var p1, p2; // from ... to
var _distanceService, _placesService;

async function getPlaceDetails(query) { // find a place by query 
	const [errQuery, results] = await place.findPlaceFromQuery(_placesService, query);
	if (errQuery || !results[0])
		return null; // no hay coincidencias
	const [err, data] = await place.getDetails(_placesService, results[0].place_id);
	return err ? null : data;
}

//initialize google maps
window.initMap = () => {
	if (!window.IRSE.editable)
		return true; // readonly mode 
	_distanceService = new google.maps.DistanceMatrixService(); // Create a instantiate of distance matrix const
	_placesService = new google.maps.places.PlacesService(coll.getDivNull()); // Create a new instance of the PlacesService
	place.setAutocomplete($1("#origen"), origen => { p1 = origen.getPlace(); }); // Origen autocomplete input 
	place.setAutocomplete($1("#destino"), destino => { p2 = destino.getPlace(); }); // Destino autocomplete input
}

export function Maps() {
	this.validateFields = data => {
		const valid = i18n.getValidators();
		valid.isDate("f2", data.f2).isTimeShort("h2", data.h2)
			.isDate("f1", data.f1).isTimeShort("h1", data.h1).le10("desp", data.desp)
			.size("destino", data.destino).size("origen", data.origen);
		if ((data.desp == 1) && !data.matricula) // vehiculo propio sin matricula
			valid.addRequired("matricula", "errMatricula");
		window.IRSE.matricula = data.matricula; // current value
		return valid.isOk();
	}

	this.validatePlaces = async (data, rutas) => {
		const valid = i18n.getValidators();
		function loadOrigen(place, pais, mask) {
			p1 = place;
			data.pais1 = pais;
			data.mask = mask;
		}

		if (!p1 && rutas.isEmpty()) // primera ruta
			loadOrigen(place.getPlaceCT(), place.getDefaultCountry(), place.getDefaultMask());
		else if (p1) // ha seleccionado un origen?
			loadOrigen(p1, place.getCountry(p1), place.isCartagena(p1) ? 4 : 0);
		else if (rutas.size() > 0) { //origen = destino anterior
			const last = rutas.last(); // ultima ruta del itinerario
			last.p2 = last.p2 || await getPlaceDetails(last.destino); // valida si hay place
			loadOrigen(last.p2, last.pais2, last.mask); // actualiza origen
		}

		p2 || valid.addRequired("destino", "errDestino"); //ha seleccionado un destino
		p1 || valid.addRequired("origen", "errOrigen"); //ha seleccionado un origen
		if (p1 && p2 && place.isSameLocality(p1, p2))
			valid.addRequired("destino", "errItinerarioCiudad");
		if (valid.isError())
			return false;

		data.p2 = p2; // current destination place
		data.dt1 = sb.toIsoDate(data.f1, data.h1);
		data.dt2 = sb.toIsoDate(data.f2, data.h2);
		data.pais2 = place.getCountry(p2);
		data.mask = ((data.mask & 4) && place.isCartagena(p2)) ? 4 : 0;
		return true;
	}

	this.getDistance = async (origen, destino) => {
		const DISTANCE_OPTIONS = { origins: [origen], destinations: [destino], travelMode: DRIVING };
		const [err, response] = await globalThis.catchError(_distanceService.getDistanceMatrix(DISTANCE_OPTIONS));
		if (err || !response.rows) { // error al calcular la distancia
			i18n.getValidators().addRequired("destino", "The calculated distance fails due to " + err);
			return null;
		}
		return ((response.rows[0].elements[0].distance.value) / 1000); //to km
	}

	this.init = place.setScript;
}

export default new Maps();
