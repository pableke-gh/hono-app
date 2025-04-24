
import coll from "../../components/Collection.js";
import tabs from "../../components/Tabs.js";
import i18n from "../../i18n/langs.js";

import model from "../model/Solicitud.js";
import firma from "../model/Firma.js";
import list from "./list.js";
import xeco from "../xeco.js";

function Firmas() {
	const self = this; //self instance

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

	tabs.setAction("rechazar", () => { // ejecuta la accion de rechazar
		const form = xeco.getForm(); // current form after initialization
		form.validate(firma.validate) && i18n.confirm("msgRechazar") && form.invoke(window.rcRechazar);
		// todo: actualizar el estado de la solicitud a rechazda
	});
	tabs.setAction("cancelar", () => { // ejecuta la accion de cancelar
		const form = xeco.getForm(); // current form after initialization
		form.validate(firma.validate) && i18n.confirm("msgCancelar") && form.invoke(window.rcCancelar);
		// todo: actualizar el estado de la solicitud a cancelada
	});

	window.loadFirmas = (xhr, status, args) => {
		if (!window.showTab(xhr, status, args, "list"))
			return false; // Server error
		const form = xeco.getForm(); // current form after initialization
		const data = list.getCurrentItem(); // get current table item
		if (form.isCached(data.id)) // checks if current item is cached
			self.view(coll.parse(args.firmas)); // update firmas blocks
		list.setProcesando();  // avoid reclick
	}
}

export default new Firmas();
