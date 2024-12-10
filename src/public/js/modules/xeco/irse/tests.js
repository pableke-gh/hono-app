
import nav from "../../../components/Navigation.js";
import place from "./place.js";

window.initMap = function() {
    const inputOrigen = $1("#ac-origen");
    const divAddress = $1(".address-components");

	place.setAutocomplete(inputOrigen, origen => {
        const placeMaps = origen.getPlace();
        divAddress.render(place.toObject(placeMaps)).show();
        console.log("CT =", place.isCartagena(placeMaps), placeMaps);
	});

    const fnVisible = () => {
		divAddress.setVisible(inputOrigen.value);
    }
    inputOrigen.focus();
    inputOrigen.addEventListener("search", fnVisible);
    inputOrigen.addEventListener("change", fnVisible);
}

// Register event on page load and export default handler
nav.ready(place.setScript);
export default place.setScript;
