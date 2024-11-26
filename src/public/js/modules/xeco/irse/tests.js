
import nav from "../../../components/Navigation.js";
import place from "./place.js";

window.initMap = function() {
	const OPTIONS = place.getOptions();
    const inputOrigen = $1("#ac-origen");
    const divAddress = $1(".address-components");
    const origen = new google.maps.places.Autocomplete(inputOrigen, OPTIONS);

    const fnVisible = () => {
		divAddress.setVisible(inputOrigen.value && origen.getPlace());
    }
    inputOrigen.focus();
    inputOrigen.addEventListener("search", fnVisible);
    inputOrigen.addEventListener("change", fnVisible);

    origen.addListener("place_changed", function() {
        const placeMaps = origen.getPlace();
        divAddress.render(place.render(placeMaps)).show();
        console.log("CT =", place.isCartagena(placeMaps), placeMaps);
    });
}

// Register event on page load and export default handler
nav.ready(place.setScript);
export default place.setScript;
