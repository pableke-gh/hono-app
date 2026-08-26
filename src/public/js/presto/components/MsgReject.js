
import presto from "../model/Presto.js";
import observer from "../../core/util/Observer.js";
import Message from "../../core/components/alerts/Message.js";

export default class MsgReject extends Message {
	connectedCallback() {
		observer.subscribe("solicitud", () => { // update message info
			this.innerText = presto.getCodigo() + ": " + presto.getMemoria();
		});
	}
}
