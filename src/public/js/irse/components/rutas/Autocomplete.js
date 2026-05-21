
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import maps from "../../services/maps.js";
import ct from "../../data/place-ct.js";

// Places list => value = place_id (string) / label = icon + place desc.
export default class AutocompleteMaps extends AutocompleteHTML {
	#getIdName = () => ((this.name == "origen") ? "oid" : "did");
	load(data) {
		const label = data[this.name]; // always force label input
		return super.setValue(data[this.#getIdName()], label).setLabel(label);
	}
	toData(data) { // export value / label
		data[this.#getIdName()] = this.getValue();
		data[this.name] = this.getLabel();
		return this;
	}
	/*addFormData(fd) {
		fd.add(this.#getIdName(), this.getValue()); // value
		fd.add(this.name, this.getLabel()); // label
		return this;
	}*/

	source() { loading(); maps.getPredictions(this.value).then(this.render).finally(working); }
	row(place) { return '<i class="fas fa-map-marker-alt icon"></i>' + place.description; }
	select(place) { return place.place_id; }

	async getPlace() {
		const placeId = this.getValue();
		if (!placeId) return null; // no place
		if (placeId == ct.place_id) return ct; // place = ct
		return await maps.getPlace(placeId); // get place by id
	}
}
