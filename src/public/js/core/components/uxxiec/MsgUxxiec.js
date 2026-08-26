
import Solicitud from "../../model/Solicitud.js";
import observer from "../../util/Observer.js";
import Message from "../alerts/Message.js";

export default class MsgReject extends Message {
	connectedCallback() {
		observer.subscribe("uxxiec", () => { // update message info
			const model = Solicitud.getInstance(); // current instance
			this.innerText = model.getCodigo() + ": " + model.getMemoria();
		});
	}
}
