
import sb from "../../../components/types/StringBox.js";
import ruta from "../../model/ruta/Ruta.js";
import rutas from "../../model/ruta/Rutas.js";
import iris from "../iris.js";
import place from "./place.js";

const getPlaceDetails = async query => { // find a place by query 
	const [errQuery, results] = await place.findPlaceFromQuery(query);
	if (errQuery || !results[0])
		return null; // no hay coincidencias
	const [err, data] = await place.getDetails(results[0].place_id);
	return err ? null : data;
}

const validateFields = data => {
	const valid = iris.getValidators();
	valid.isDate("f2", data.f2).isTimeShort("h2", data.h2)
		.isDate("f1", data.f1).isTimeShort("h1", data.h1).le10("desp", data.desp)
		.size("destino", data.destino).size("origen", data.origen);
	if ((data.desp == 1) && !data.matricula) // vehiculo propio sin matricula
		valid.addRequired("matricula", "errMatricula");
	return valid.isOk();
}

place.validate = async () => {
	const form = iris.getForm();
	const valid = iris.getValidators();
	const data = form.validate(validateFields, ".ui-ruta");
	if (!data) // inputs validation
		return false;

	let p1 = place.getOrigen();
	let p2 = place.getDestino();

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
		const last = rutas.getLlegada(); // ultima ruta del itinerario
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
	return ruta.valid(data) && data;
}

place.getDistance = async (origen, destino) => {
	const [err, response] = await place.getDistanceMatrix(origen, destino);
	if (err || !response.rows) { // error al calcular la distancia
		const valid = iris.getValidators(); // get form validators
		valid.addRequired("destino", "The calculated distance fails due to " + err);
		return null;
	}
	return ((response.rows[0].elements[0].distance.value) / 1000); //to km
}

export default place;
