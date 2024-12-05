
import sb from "../../../components/StringBox.js";
import dom from "../../../lib/uae/dom-box.js";

import place from "./place.js";
import rutas from "./rutas.js";

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
	const elAddRuta = $1("#add-ruta"); // html button
	if (!elAddRuta) return true; // readonly mode

	const OPTIONS = place.getOptions();
	const origen = new google.maps.places.Autocomplete(document.getElementById("origen"), OPTIONS); //Get the autocomplete input
	const destino = new google.maps.places.Autocomplete(document.getElementById("destino"), OPTIONS); //Get the autocomplete input
	const distanceService = new google.maps.DistanceMatrixService(); // Create a instantiate of distance matrix const
	const placesService = new google.maps.places.PlacesService(); // Create a new instance of the PlacesService

	var p1, p2; // from..to
	origen.addListener("place_changed", function() { p1 = origen.getPlace(); }); //Get the place details from autocomplete
	destino.addListener("place_changed", function() { p2 = destino.getPlace(); }); //Get the place details from autocomplete

	//*************** rutas / trayectos - maps ***************//
	elAddRuta.onclick = async ev => {
		ev.preventDefault(); // stop event
		const ruta = dom.getData(); // form data
		function loadOrigen(place, pais, mask) {
			p1 = place;
			ruta.pais1 = pais;
			ruta.mask = mask;
		}

		dom.closeAlerts().intval("#desp", "errTransporte", "errRequired")
			.required("#f2", "errDate").required("#h2", "errDate")
			.required("#f1", "errDate").required("#h1", "errDate")
			.required("#destino", "errDestino").required("#origen", "errOrigen");

		if (!p1 && rutas.empty()) // primera ruta
			loadOrigen(place.getPlaceCT(), place.getDefaultCountry(), place.getDefaultMask());
		else if (p1) // ha seleccionado un origen?
			loadOrigen(p1, place.getCountry(p1), place.isCartagena(p1) ? 4 : 0);
		else if (rutas.size() > 0) { //origen = destino anterior
			const last = rutas.last(); // ultima ruta
			if (last.p2)
				loadOrigen(last.p2, last.pais2, last.mask);
			else {
				OPTIONS.query = last.destino;
				[err, last.p2] = await globalThis.catchError(placesService.findPlaceFromQuery(OPTIONS));
				if (err || (response.status !== google.maps.DistanceMatrixStatus.OK)) // status !== "OK"
					dom.addError("#origen", "No se ha podido obtener el origen del trayecto debido a: " + (err || response.status));
				else
					loadOrigen(last.p2, last.pais2, last.mask);
			}
		}

		p2 || dom.addError("#destino", "errDestino", "errRequired"); //ha seleccionado un destino
		p1 || dom.addError("#origen", "errOrigen", "errRequired"); //ha seleccionado un origen
		if (p1 && p2 && place.isSameLocality(p1, p2))
			dom.addError("#origen", "errItinerarioCiudad", "errRequired")
		if (dom.isError())
			return false;

		ruta.p2 = p2; // current destination place
		ruta.dt1 = sb.toIsoDate(ruta.f1, ruta.h1);
		ruta.dt2 = sb.toIsoDate(ruta.f2, ruta.h2);
		ruta.pais2 = place.getCountry(p2);
        ruta.mask = ((ruta.mask & 4) && place.isCartagena(p2)) ? 4 : 0;

		p1 = p2 = null; // re-init. places
		if (!rutas.valid(ruta)) // extra validations
			return false;

		if (ruta.desp != "1") // no calculate distance
			return rutas.add(ruta, null);

		const DISTANCE_OPTIONS = {
			origins: [ruta.origen],
			destinations: [ruta.destino],
			travelMode: DRIVING
		};
		const [err, response] = await globalThis.catchError(distanceService.getDistanceMatrix(DISTANCE_OPTIONS));
		if (err || (response.status !== google.maps.DistanceMatrixStatus.OK)) // status !== "OK"
			return !dom.addError("#origen", "The calculated distance fails due to " + (err || response.status));
		ruta.km2 = response.rows[0].elements[0].distance.value / 1000; //to km
		rutas.add(ruta, ruta.km2); // add to table
		/*distance.getDistanceMatrix(DISTANCE_OPTIONS, function(res, status) {
			if (status !== google.maps.DistanceMatrixStatus.OK) //status !== "OK"
				return !dom.addError("#origen", "The calculated distance fails due to " + status);
			const origins = res.originAddresses;
			//var destinations = res.destinationAddresses;
			for (let i = 0; i < origins.length; i++) {
				const results = res.rows[i].elements;
				for (let j = 0; j < results.length; j++) {
					const element = results[j];
					ruta.km2 = element.distance.value/1000; //to km
				}
			}
			rutas.add(ruta, ruta.km2);
		});*/
	}
}

export default place.setScript;
