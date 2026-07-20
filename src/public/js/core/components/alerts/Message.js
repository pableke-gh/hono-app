
import msgs from "./MsgContainer.js";

export default class Message extends HTMLParagraphElement {
	isOk = () => this.classList.contains("alert-success"); // check if alert is success type
	isInfo = () => this.classList.contains("alert-info"); // check if alert is info type
	isWarn = () => this.classList.contains("alert-warn"); // check if alert is warning type
	isError = () => this.classList.contains("alert-error"); // check if alert is error type

	hide = () => this.classList.add("hide"); // arrow final function
	show = () => this.classList.remove("hide"); // arrow final function
	setVisible(visible) { visible ? this.show() : this.hide(); }

	#setMessage(type, icon, message) {
		this.className = "notice notice-" + type;
		if (this.children.length > 1) { // assume left icon
			this.children[0].innerHTML = icon; // set icon
			this.children[1].innerText = i18n.msg(message); // set text
		}
		else
			this.innerText = i18n.msg(message); // set text
	}
	setOk(message) { this.#setMessage("success", '<i class="fas fa-check-circle fa-2x"></i>', message); }
	setInfo(message) { this.#setMessage("info", '<i class="fas fa-info fa-3x"></i>', message); }
	setWarn(message) { this.#setMessage("warn", '<i class="fas fa-exclamation-triangle fa-2x"></i>', message); }
	setError(message) { this.#setMessage("error", '<i class="fas fa-exclamation fa-3x"></i>', message); }

	connectedCallback() {
		this.id && msgs.set(this.id, this); // register message
	}
}
