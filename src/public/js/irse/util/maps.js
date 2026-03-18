
import coll from "../../components/CollectionHTML.js";
import sb from "../../components/types/StringBox.js";
import tabs from "../../components/Tabs.js";
import valid from "../i18n/validators.js";
import result from "../../core/util/Result.js";

import place from "./place.js";
import form from "../modules/irse.js";

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

//initialize google maps
window.initMap = () => {
	var p1, p2; // from ... to
	const distanceService = new google.maps.DistanceMatrixService(); // Create a instantiate of distance matrix const (legacy)
	//const { RouteMatrix } = await google.maps.importLibrary("routes"); // Create a instantiate of distance matrix const (new)
	const placesService = new google.maps.places.PlacesService(coll.getDivNull()); // Create a new instance of the PlacesService (legacy)
	//const { Place, PlaceAutocompleteElement } = await google.maps.importLibrary("places"); // Create a new instance of the PlacesService (new)
	place.setAutocomplete(form.getInput("#origen"), origen => { p1 = origen.getPlace(); }) // Origen autocomplete input 
		.setAutocomplete(form.getInput("#destino"), destino => { p2 = destino.getPlace(); }); // Destino autocomplete input

	function getPlaceDetails(query) { // find a place by query
		const PLACES_OPTIONS = { query, fields: [ "place_id" ] };
		return new Promise((resolve, reject) => {
			placesService.findPlaceFromQuery(PLACES_OPTIONS, (results, status) => {
				if (status !== google.maps.places.PlacesServiceStatus.OK)
					return reject(status);
				const DETAILS_OPTIONS = { placeId: results[0].place_id, fields: [ "address_components" ] };
				placesService.getDetails(DETAILS_OPTIONS, (place, status) => {
					if (status !== google.maps.places.PlacesServiceStatus.OK)
						return reject(status);
					resolve(place);
				});
			});
		});
	}
	/*async function findPlaces(textQuery) {
		const PLACES_OPTIONS = { textQuery, fields: [ "displayName", "location", "addressComponents" ] };
		const { places } = await Place.searchByText(PLACES_OPTIONS);
console.log('places: ', places);
		places.forEach(place => {
			console.log('Place Name:', place.displayName);
			console.log('Location:', place.location);

			// Extract address components
			const addressComponents = place.addressComponents || [];
			const streetNumber = addressComponents.find(comp => comp.types.includes('street_number'))?.long_name || '';
			const route = addressComponents.find(comp => comp.types.includes('route'))?.long_name || '';
			const locality = addressComponents.find(comp => comp.types.includes('locality'))?.long_name || '';
			const administrativeArea = addressComponents.find(comp => comp.types.includes('administrative_area_level_1'))?.long_name || '';
			const postalCode = addressComponents.find(comp => comp.types.includes('postal_code'))?.long_name || '';
			const country = addressComponents.find(comp => comp.types.includes('country'))?.long_name || '';

			console.log('Address Components:');
			console.log(`  Street: ${streetNumber} ${route}`);
			console.log(`  City: ${locality}`);
			console.log(`  State: ${administrativeArea}`);
			console.log(`  Postal Code: ${postalCode}`);
			console.log(`  Country: ${country}`);
		});
		return (places && places.length) ? places[0] : null;
	}*/

	//*************** rutas / trayectos - maps ***************//
	tabs.setAction("addRuta", async () => {
		const rutas = form.getRutas(); // module
		const ruta = valid.addRuta(); // form data
		if (!ruta) return false; // invalid inputs

		const loadOrigen = (place, pais, mask) => {
			p1 = place;
			ruta.pais1 = pais;
			ruta.mask = mask;
		}

		if (!p1 && rutas.isEmpty()) // primera ruta
			loadOrigen(place.getPlaceCT(), place.getDefaultCountry(), place.getDefaultMask());
		else if (p1) // ha seleccionado un origen?
			loadOrigen(p1, place.getCountry(p1), place.isCartagena(p1) ? 4 : 0);
		else if (rutas.size() > 0) { //origen = destino anterior
			const last = rutas.last(); // ultima ruta
			if (!last.p2) // tiene el destino?
				last.p2 = (await result.catch(getPlaceDetails(last.destino))).getData();
				//last.p2 = findPlaces(last.destino);
			loadOrigen(last.p2, last.pais2, last.mask);
		}

		p2 || valid.addRequired("destino", "errDestino"); //ha seleccionado un destino
		p1 || valid.addRequired("origen", "errOrigen"); //ha seleccionado un origen
		if (p1 && p2 && place.isSameLocality(p1, p2)) // is same place?
			valid.addRequired("origen", "errItinerarioCiudad");
		if (valid.isError()) return valid.fail(); // places validator

		ruta.p2 = p2; // current destination place
		ruta.dt1 = sb.toIsoDate(ruta.f1, ruta.h1);
		ruta.dt2 = sb.toIsoDate(ruta.f2, ruta.h2);
		ruta.pais2 = place.getCountry(p2);
        ruta.mask = ((ruta.mask & 4) && place.isCartagena(p2)) ? 4 : 0;

		p1 = p2 = null; // re-init. places
		if (!valid.ruta(ruta)) // extra validations
			return false;

		if (ruta.desp != "1") // no calculate distance
			return rutas.add(ruta, null);

		const DISTANCE_OPTIONS = {
			origins: [ruta.origen],
			destinations: [ruta.destino],
			//fields: ['durationMillis', 'distanceMeters'], // Must be an array (new)
			travelMode: DRIVING
		};
		await result.catch(distanceService.getDistanceMatrix(DISTANCE_OPTIONS));
		if (result.isError()) // error al calcular la distancia
			return result.error("The calculated distance fails due to " + result.getError());
		ruta.km2 = result.getData().rows[0].elements[0].distance.value / 1000; //to km
		rutas.add(ruta, ruta.km2); // add to table
	});
}

export default place.setScript;
