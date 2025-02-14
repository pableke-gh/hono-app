
import ct from "../data/place-ct.js"

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
const fnGetLongName = (place, type) => fnGetComponent(place, type)?.long_name;
const fnGetPostalCode = place => fnGetShortName(place, "postal_code");
//get postal code / locality short name from place (30XXX, Cartagena, Madrid,...)
const fnLocality = place => fnGetPostalCode(place) || fnGetShortName(place, "locality");

const fnMadrid = place => ("MD" == fnGetShortName(place, "administrative_area_level_1")); // CCAA de Madrid
const fnBarcelona = place => ("B" == fnGetShortName(place, "administrative_area_level_2")); // Provincia de barcelona

var isLoaded;

function Place() {
	const self = this; //self instance

	this.getDefaultMask = () => 4;
	this.getDefaultCountry = () => "ES";

	this.getPlaceCT = () => ct; // object place for CT
	this.getAutocomplete = input => new google.maps.places.Autocomplete(input, OPTIONS); // Get the autocomplete input
	this.setAutocomplete = (input, fn) => { // Autocomplete event
		const ac = self.getAutocomplete(input);
		ac.addListener("place_changed", () => fn(ac));
		return self;
	}

	this.isPlace = place => place && place.address_components; // valid selected place
	this.isCartagena = place => CARTAGENA.includes(fnLocality(place)); // Localidad de cartagena
	this.isSameLocality = (p1, p2) => (fnLocality(p1) == fnLocality(p2)); // Same postal code

	//get country short name from place (ES, EN, GB, IT,...)
	this.getCountry = place => {
		const pais = fnGetShortName(place, "country");
		if ((pais == "ES") && fnMadrid(place))
			return "ES-MD"; // Dieta para madrid comunidad
		if ((pais == "ES") && fnBarcelona(place))
			return "ES-BA"; // dieta para barcelona provincia
		return pais;
	}

	this.toObject = (place, output) => {
		output = output || {}; // default container
		if (!self.isPlace(place)) // is selected a place?
			return output; // empty object address
		output.cp = fnGetPostalCode(place) || "-";
		output.dir = fnGetLongName(place, "route") || "-";
		output.localidad = fnGetShortName(place, "locality") || "-";
		output.provincia = fnGetLongName(place, "administrative_area_level_2") + " (" + fnGetShortName(place, "administrative_area_level_2") + ")";
		output.ccaa = fnGetLongName(place, "administrative_area_level_1") + " (" + fnGetShortName(place, "administrative_area_level_1") + ")";
		output.pais = fnGetLongName(place, "country") + " (" + fnGetShortName(place, "country") + ")";
		return output;
	}

	this.setScript = () => {
		if (isLoaded)
			return window.initMap(); // script preloaded
		// Create the script tag, set the appropriate attributes
		const script = document.createElement("script");
		script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBIlqxZkVg9GyjzyNzC0rrZiuY6iPLzTZI&libraries=places&loading=async&callback=initMap";
		script.async = true; // Solicita al navegador que descargue y ejecute la secuencia de comandos de manera asíncrona, despues llamará a initMap
		script.defer = true; // Will execute the script after the document has been parsed
		document.head.appendChild(script); // Append the "script" element to "head"
		isLoaded = true;
	}
}

export default new Place();
