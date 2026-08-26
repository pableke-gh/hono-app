
import irse from "../../model/Irse.js";
import rutas from "../../model/Rutas.js";
import observer from "../../../core/util/Observer.js";

import Toggle from "../../../core/components/tabs/Toggle.js";
import tables from "../../components/tables/tables.js";

export default class ToggleItinerario extends Toggle {
	connectedCallback() {
		super.connectedCallback(); // init. component
		observer.subscribe("solicitud", () => { // handler
			const visible = irse.isEditable() && (rutas.size() > 1); // hide for mun
			this.parentNode.classList.toggle("hide", !visible); // show / hide link block

			// notice about itinerario
			const noticeInfo2 = this.parentNode.previousElementSibling;
			noticeInfo2.classList.toggle("hide", !visible); // info notice
			const noticeInfo1 = noticeInfo2.previousElementSibling;
			noticeInfo1.classList.toggle("hide", !irse.isEditable()); // info editable
			noticeInfo1.previousElementSibling.classList.toggle("hide", !irse.isEditableP8()); // info p8
		});
	}

	beforeOpen() {
		tables.get("tItinerario").view(); // table itinerario (readonly)
	}
}
