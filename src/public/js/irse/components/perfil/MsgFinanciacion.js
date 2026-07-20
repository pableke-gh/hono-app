
import irse from "../../model/Irse.js";
import i18n from "../../i18n/langs.js";
import observer from "../../../core/util/Observer.js";
import Message from "../../../core/components/alerts/Message.js";

export default class MsgFinanciacion extends Message {
	update = () => {
		if (irse.isXsu())
			this.innerText = i18n.get("msgXsu");
		else if (irse.isIsu())
			this.innerText = i18n.get("msgIsu");
		else if (irse.isX83())
			this.innerText = i18n.get("msgX83");
		else if (irse.isA83())
			this.innerText = i18n.get("msgA83");
		else
			this.innerText = "";
		this.setVisible(irse.isIsu() || irse.isA83());
	}

	connectedCallback() {
		observer.subscribe("perfil", this.update);
	}
}
