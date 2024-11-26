
import sb from "../../../components/StringBox.js";
import dom from "../../../lib/uae/dom-box.js";

import place from "./place.js";
import rutas from "./rutas.js";

//initialize google maps
window.initMap = () => {
	const elAddRuta = $1("#add-ruta"); // html button
	if (!elAddRuta) return true; // readonly mode

	const OPTIONS = place.getOptions();
	const origen = new google.maps.places.Autocomplete(document.getElementById("origen"), OPTIONS); //Get the autocomplete input
	const destino = new google.maps.places.Autocomplete(document.getElementById("destino"), OPTIONS); //Get the autocomplete input
	const distance = new google.maps.DistanceMatrixService(); //Instantiate a distance matrix

	var p1, p2; // from..to
	origen.addListener("place_changed", function() { p1 = origen.getPlace(); }); //Get the place details from autocomplete
	destino.addListener("place_changed", function() { p2 = destino.getPlace(); }); //Get the place details from autocomplete

	//*************** rutas / trayectos - maps ***************//
	elAddRuta.onclick = ev => {
		ev.preventDefault(); // stop event
		let loc1 = null; //source location

		if (!p1 && rutas.empty()) { //primera ruta
			loc1 = new google.maps.LatLng(CT.lat, CT.lng);
			loc1.pais = CT.pais;
			loc1.mask = CT.mask;
		}
		else if (p1) { //ha seleccionado un origen?
			loc1 = p1.geometry.location;
			loc1.pais = place.getCountry(p1);
			loc1.mask = place.isCartagena(p1) ? 4 : 0;
		}
		else if (rutas.size() > 0) { //origen=destino anterior?
			let last = rutas.last();
			loc1 = new google.maps.LatLng(last.lat2, last.lng2);
			loc1.pais = last.pais2;
			loc1.mask = last.mask;
		}

		dom.closeAlerts().intval("#desp", "errTransporte", "errRequired")
			.required("#f2", "errDate", "errRequired").required("#h2", "errDate")
			.required("#f1", "errDate", "errRequired").required("#h1", "errDate")
			.required("#destino", "errDestino", "errRequired")
			.required("#origen", "errOrigen", "errRequired");
		p2 || dom.addError("#destino", "errDestino", "errRequired"); //ha seleccionado un destino
		loc1 || dom.addError("#origen", "errOrigen", "errRequired"); //ha seleccionado un origen
		if (dom.isError())
			return false;

		//new place data and read location from loc1 and loc2
		const ruta = dom.getData();
		ruta.dt1 = sb.toIsoDate(ruta.f1, ruta.h1);
		ruta.dt2 = sb.toIsoDate(ruta.f2, ruta.h2);
		ruta.lat1 = loc1.lat();
		ruta.lng1 = loc1.lng();
		ruta.pais1 = loc1.pais;
		ruta.lat2 = p2.geometry.location.lat();
		ruta.lng2 = p2.geometry.location.lng();
		ruta.pais2 = place.getCountry(p2);
        ruta.mask = ((loc1.mask & 4) && place.isCartagena(p2)) ? 4 : 0;

		//validate data
		if (ruta.origen == ruta.destino)
			return !dom.addError("#origen", "errItinerarioCiudad", "errRequired");
		if (!rutas.valid(ruta))
			return false;

		if (ruta.desp == "1") //calculate distance
			distance.getDistanceMatrix({
				origins: [loc1],
				destinations: [p2.geometry.location],
				travelMode: "DRIVING"
			}, function(res, status) {
				if (status !== "OK")
					return !dom.addError("#origen", "The calculated distance fails due to " + status);
				var origins = res.originAddresses;
				//var destinations = res.destinationAddresses;
				for (var i = 0; i < origins.length; i++) {
					var results = res.rows[i].elements;
					for (var j = 0; j < results.length; j++) {
						var element = results[j];
						ruta.km2 = element.distance.value/1000; //to km
					}
				}
				rutas.add(ruta, ruta.km2);
			});
		else
			rutas.add(ruta, null);
		p1 = p2 = null;
	}
}

export default place.setScript;
