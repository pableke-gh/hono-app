
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import maps from "../../services/maps.js";

export default class AutocompleteMaps extends AutocompleteHTML {
	isLoaded() { return super.isLoaded() && (super.getIndex() > -1); }
	setValue(value) { return super.setValue(value, value); } // override

	source() { loading(); maps.getPredictions(this.value).then(this.render).finally(working); }
	row(place) { return '<i class="fas fa-map-marker-alt icon"></i>' + place.description; }
	select(place) { return place.description; } // place.place_id

	async getPlace() {
		const place = this.getCurrent();
		return place ? await maps.getPlace(place.place_id) : null;
	}
}
