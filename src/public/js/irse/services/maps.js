
import coll from "../../components/CollectionHTML.js";

class Maps {
	#geocoder; #distanceService; #placesService; #autocompleteService; #token;
	//const { Place, AutocompleteSessionToken, AutocompleteSuggestion } = await google.maps.importLibrary("places"); // Load the Places library

	init() {
		this.#geocoder = new google.maps.Geocoder(); // direct request to search text
		this.#distanceService = new google.maps.DistanceMatrixService(); // Create a instantiate of distance matrix const (legacy)
		this.#placesService = new google.maps.places.PlacesService(coll.getDivNull()); // Create a new instance of the PlacesService (legacy)
		this.#autocompleteService = new google.maps.places.AutocompleteService(); // Initialize the AutocompleteService
		this.#token = new google.maps.places.AutocompleteSessionToken(); // Create a session token for billing
	}

	getPlaces(address) {
		return new Promise((resolve, reject) => {
			this.#geocoder.geocode({ address }, (results, status) => {
				// get fields: address_components, formatted_address, place_id, etc.
				(status === google.maps.GeocoderStatus.OK) ? resolve(results) : reject(status);
			});
		});
	}
	
	getPlace(placeId) {
		return new Promise((resolve, reject) => {
			const DETAILS_OPTIONS = { placeId, fields: [ "name", "address_components" ] };
			this.#placesService.getDetails(DETAILS_OPTIONS, (place, status) => {
				(status === google.maps.places.PlacesServiceStatus.OK) ? resolve(place) : reject(status);
			});
		});
	}

	// Call getPlacePredictions to fetch predictions
	getPredictions(input) {
		const sessionToken = this.#token; // token required
		// Define the input query and restrict to places and geocoding results
		const request = { input, sessionToken, types: [ "establishment", "geocode" ] };
		return new Promise((resolve, reject) => { // build a new promise
			this.#autocompleteService.getPlacePredictions(request, (predictions, status) => {
				// Use prediction.place_id to fetch more details via Place Details API
				(status === google.maps.places.PlacesServiceStatus.OK && predictions) ? resolve(predictions) : reject(status);
			});
		});
	}
	// Fetch autocomplete suggestions
	async getSuggestions(input) {
		const request = { input, sessionToken, includedPrimaryTypes: [ "establishment", "geocode" ] };
		const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
		suggestions.forEach(suggestion => console.log(suggestion.placePrediction));
		return suggestions;
	}

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
	async getDistance(origen, destino) {
		const request = {
			origins: [ origen ], destinations: [ destino ],
			//fields: ['durationMillis', 'distanceMeters'], // Must be an array (new)
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.METRIC
		};
		return new Promise((resolve, reject) => {
			this.#distanceService.getDistanceMatrix(request, (response, status) => {
				if (status !== "OK")
					return reject("The calculated distance fails due to " + status);
				const result = response.rows[0].elements[0];
				if (result.status !== "OK")
					return reject("The calculated distance fails due to " + result.status);
				resolve(result.distance.value / 1000); //to km
			});
		});
	}
}

export default new Maps();
