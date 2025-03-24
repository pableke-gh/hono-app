
import coll from "../../components/Collection.js";
import i18n from "../../i18n/langs.js";

import xeco from "../xeco.js";
import model from "../model/Solicitud.js";
import firma from "../model/Firma.js";

function Firmas() {
	this.init = () => {
		const form = xeco.getForm(); // current form after initialization
		form.set("is-rechazada", model.isRechazada).set("has-firmas", globalThis.void);
	}

	this.view = firmas => {
		const form = xeco.getForm();
		form.set("has-firmas", () => firmas);
		if (!firmas) return; // nada que actualizar
		const blocks = form.querySelectorAll(".ui-firmantes");
		blocks.html(coll.render(firmas, firma.render));
		if (model.isRechazada()) {
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
