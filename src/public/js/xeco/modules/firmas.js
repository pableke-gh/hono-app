
import coll from "../../components/Collection.js";
import model from "../model/Solicitud.js";
import firma from "../model/Firma.js";
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
		if (!firmas) // compruebo si hay firmas
			return; // nada que actualizar

		const blocks = form.querySelectorAll(".ui-firmantes");
		// extraigo la firma del grupo de gastores (grupo = -1)
		blocks.html(coll.render(firmas.slice(1), firma.render));
		if (model.isInvalidada()) { // solicitud rechazada o cancelada
			const rechazo = firmas.find(firma.isRechazada);
			rechazo.rejectedBy = firma.getNombre(rechazo);
			blocks.forEach(el => el.nextElementSibling.render(rechazo));
		}
		form.reset("#rechazo");
		return self;
	}

	this.refresh = data => {
		xeco.getForm().reset("#rechazo").refresh(model.setData(data));
		return self;
	}

	this.update = data => {
		const form = xeco.getForm();
		form.set("has-firmas", () => form.isCached(data.id));
		return self.refresh(data);
	}
}

export default new Firmas();
