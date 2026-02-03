
import coll from "../../../components/CollectionHTML.js";
import form from "../../../xeco/modules/solicitud.js";
import ct from "../../data/place-ct.js"

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

const OPTIONS = { // Place autocomplete config.
	fields: [ "address_component", "geometry" ],
	types: [ "geocode", "establishment" ],
	strictBounds: false
};

const CARTAGENA = [
	"Cartagena", "30200", "30201", "30202", "30203", "30204", "30205", "30280", "30290", "30300", "30310", "30319", 
	"30330", "30350", "30351", "30353", "30365", "30366", "30367", "30368", "30369", "30370", "30380", "30381", "30382", 
	"30383", "30384", "30385", "30386", "30387", "30390", "30391", "30392", "30393", "30394", "30395", "30396", "30397", 
	"30398", "30399", "30593", "30594", "30835", "30868"
];

//get address component from type
const fnGetComponent = (place, type) => place.address_components.find(ac => ac.types.includes(type));
const fnGetShortName = (place, type) => fnGetComponent(place, type)?.short_name;
//const fnGetLongName = (place, type) => fnGetComponent(place, type)?.long_name;
const fnGetPostalCode = place => fnGetShortName(place, "postal_code");
//get postal code / locality short name from place (30XXX, Cartagena, Madrid,...)
const fnLocality = place => fnGetPostalCode(place) || fnGetShortName(place, "locality");

const fnMadrid = place => ("MD" == fnGetShortName(place, "administrative_area_level_1")); // CCAA de Madrid
const fnBarcelona = place => ("B" == fnGetShortName(place, "administrative_area_level_2")); // Provincia de barcelona

const setAutocomplete = (input, fn) => {
	const autocomplete = new google.maps.places.Autocomplete(input, OPTIONS); // Get the autocomplete input
	autocomplete.addListener("place_changed", () => fn(autocomplete.getPlace())); // Add event listener when place selected
}

let p1, p2; // from ... to
const MAPS = {
	getOrigen: () => p1,
	getDestino: () => p2,
	getPlaceCT: () => ct, // CT place object
	getDefaultMask: () => 4, // 4 = 0b100
	getDefaultCountry: () => "ES", // spain
	//isPlace: place => place && place.address_components, // valid selected place
	isCartagena: place => CARTAGENA.includes(fnLocality(place)), // Localidad de cartagena
	isSameLocality: (p1, p2) => (fnLocality(p1) == fnLocality(p2)), // Same postal code
	getCountry: place => { //get country short name from place (ES, EN, GB, IT,...)
		const pais = fnGetShortName(place, "country");
		if ((pais == "ES") && fnMadrid(place))
			return "ES-MD"; // Dieta para madrid comunidad
		if ((pais == "ES") && fnBarcelona(place))
			return "ES-BA"; // dieta para barcelona provincia
		return pais;
	}
}

window.initMap = function() {
	// Initialize google maps services
	const _distanceService = new google.maps.DistanceMatrixService(); // Create a instantiate of distance matrix const
	const _placesService = new google.maps.places.PlacesService(coll.getDivNull()); // Create a new instance of the PlacesService

	const findPlaceFromQuery = query => new Promise((resolve, reject) => {
		const ok = google.maps.places.PlacesServiceStatus.OK;
		const fnResults = (results, status) => (status === ok) ? resolve(results) : reject(status);
		_placesService.findPlaceFromQuery({ query, fields: [ "place_id" ] }, fnResults);
	});
	const getDetails = placeId => new Promise((resolve, reject) => {
		const ok = google.maps.places.PlacesServiceStatus.OK;
		const fnGetPlace = (place, status) => (status === ok) ? resolve(place) : reject(status);
		_placesService.getDetails({ placeId, fields: [ "address_components" ] }, fnGetPlace);
	});

	MAPS.getDistance = (origen, destino) => {
		const DISTANCE_OPTIONS = { origins: [origen], destinations: [destino], travelMode: DRIVING };
		return _distanceService.getDistanceMatrix(DISTANCE_OPTIONS)
				.then(response => ((response.rows[0].elements[0].distance.value) / 1000)) //to km
				.catch(err => { throw "The calculated distance fails due to " + err; });
	}
	MAPS.getPlaceDetails = query => { // find a place by query 
		return findPlaceFromQuery(query)
					.then(results => getDetails(results[0].place_id))
					.catch(err => { throw err; });
	}

	setAutocomplete(form.getInput("#origen"), place => { p1 = place; }); // Origen autocomplete input 
	setAutocomplete(form.getInput("#destino"), place => { p2 = place; }); // Destino autocomplete input
}

export default MAPS;
