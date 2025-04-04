
import place from "../../services/place.js";

window.afterInitMap = async () => {
    const inputOrigen = $1("#ac-origen");
    const divAddress = $1(".address-components");

	place.setAutocomplete(inputOrigen, placeMaps => {
		divAddress.render(place.toObject(placeMaps)).show();
		console.log("CT =", place.isPlace(placeMaps) && place.isCartagena(placeMaps), placeMaps); 
	});
	//const { SearchBox } = await google.maps.importLibrary("places");
	//const sb = new SearchBox(inputOrigen, { types: [ "geocode", "establishment" ] });
	//sb.addListener('places_changed', ev => console.log(sb.getPlaces()));

    const fnVisible = () => divAddress.setVisible(inputOrigen.value);
    inputOrigen.addEventListener("search", fnVisible);
    inputOrigen.addEventListener("change", fnVisible);
}

export default place;
