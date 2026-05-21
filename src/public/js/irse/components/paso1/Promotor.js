
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import api from "../../../components/Api.js";

import irse from "../../model/Irse.js";
import firma from "../../../core/model/Firma.js";

export default class Promotor extends AutocompleteHTML {
	connectedCallback() { // Initialize element
		this.setMinLength(4);
	}

	source() { api.init().json("/uae/iris/personal", { id: irse.getId(), term: this.value }).then(this.render); }
	setFirma(data) { return data ? super.setValue(data.nif, firma.getFirmante(data)) : this.clear(); }
	setPromotor(firmas) { return firmas ? this.setFirma(firmas.find(firma.isPromotor)) : this.clear(); }
}
