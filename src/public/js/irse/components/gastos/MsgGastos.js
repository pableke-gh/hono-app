
import i18n from "../../i18n/langs.js";
import irse from "../../model/Irse.js";
import rutas from "../../model/Rutas.js";
import observer from "../../../core/util/Observer.js";
import Message from "../../../core/components/alerts/Message.js";

export default class MsgGastos extends Message {
	#template = this.innerHTML; // save template

	update = () => {
		this.setText(i18n.render(this.#template, irse));
		this.setVisible(rutas.size() > 1);
	}

	connectedCallback() {
		observer.subscribe("solicitud", this.update);
	}
}
