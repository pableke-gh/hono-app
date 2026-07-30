
import DataList from "../../../core/components/forms/DataList.js";
import sb from "../../../components/types/StringBox.js";
import api from "../../../core/components/Api.js";
import factura from "../../model/Factura.js";

export default class Face extends DataList {
	#ej = sb.getYear();

	isLoaded = ej => (this.#ej == ej); // economicas cargadas
	setEditable() {
		this.setVisible(factura.isUae());
		this.form.elements.iban.setVisible(factura.isUae());
		this.setReadonly(!factura.isEditableUae());
	}

	/* deprecated functions, preserve for old compatibility */
	load(data) { // deprecated => old compatibility
		if (this.isLoaded(data.ej))
			return this.setValue(data.idEco); // set current value
		api.init().json("/uae/fact/economicas?ej=" + data.ej).then(economicas => {
			this.#ej = data.ej; // set cache indicator
			this.setItems(economicas, true); // update options
			this.setValue(data.idEco); // set current value
		});
	}
	prepare(model) { this.setEditable(); this.load(model.getData()); } // deprecated: old compatibility
	update(tip, msg) { return tip ? this.setError(tip, msg) : !this.setOk(); } // deprecated: old compatibility
	/* deprecated functions, preserve for old compatibility */

	setEconomica(eco) {
		this.setIndex(this.getLabels().findIndex(label => label.startsWith(eco)));
	}

	toData(data) {
		super.toData(data);
		data.economica = this.getCode();
	}

	connectedCallback() {
		this.setEmptyOption("lblSelectEco");
	}
}
