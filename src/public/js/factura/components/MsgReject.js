
import factura from "../model/Factura.js";
import observer from "../../core/util/Observer.js";
import Message from "../../core/components/alerts/Message.js";

export default class MsgReject extends Message {
	connectedCallback() {
		observer.subscribe("solicitud", () => { // update message info
			this.innerText = factura.getCodigo() + ": " + factura.getMemoria();
		});
	}
}
