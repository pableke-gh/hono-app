
import coll from "../../components/Collection.js";
import i18n from "../../i18n/langs.js";

import model from "../model/Solicitud.js";
import firma from "../model/Firma.js";
import xeco from "../xeco.js";

function Firmas() {
	this.init = () => {
		const form = xeco.getForm(); // current form after initialization
		form.set("is-invalidada", model.isInvalidada).set("has-firmas", globalThis.void);
	}

	this.view = firmas => {
		const form = xeco.getForm();
		form.set("has-firmas", () => firmas);
		if (!firmas) return; // nada que actualizar
		const blocks = form.querySelectorAll(".ui-firmantes");
		// extraigo la firma principal del grupo de gastores = -1
		blocks.html(coll.render(firmas.slice(1), firma.render));
		if (model.isInvalidada()) { // solicitud rechazada o cancelada
			const rechazo = firmas.find(firma.isRechazada);
			rechazo.rejectedBy = firma.getNombre(rechazo);
			blocks.forEach(el => el.nextElementSibling.render(rechazo));
		}
		form.reset("#rechazo");
	}

	window.fnRechazar = () => {
		const form = xeco.getForm(); // current form after initialization
		return form.validate(firma.validate) && i18n.confirm("msgRechazar") && window.loading();
	}
}

export default new Firmas();
