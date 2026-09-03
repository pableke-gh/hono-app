
import i18n from "../../i18n/langs.js";
import irse from "../../model/Irse.js";
import interesado from "../../model/Interesado.js";
import observer from "../../../core/util/Observer.js";
import Message from "../../../core/components/alerts/Message.js";

export default class MsgInteresado extends Message {
	connectedCallback() {
		observer.subscribe("solicitud", () => { // update info rutas
			this.nextElementSibling.classList.toggle("hide", !irse.isEditable()); // show / hide message
		});

		observer.subscribe("interesado", () => { // update message info
			this.innerText = i18n.get('lblDomicilio') + ": " + interesado.getDomicilio();
		});
	}
}
