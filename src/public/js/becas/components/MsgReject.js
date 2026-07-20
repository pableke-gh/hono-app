
import Message from "../../core/components/alerts/Message.js";

export default class MsgReject extends Message {
	connectedCallback() {
		document.forms.beca.addObserver(data => {
			this.innerText = data.codigo + " " + data.desc;
		});
	}
}
