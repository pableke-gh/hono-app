
import i18n from "../i18n/langs.js";

export default class Alert extends HTMLDivElement {
	constructor() {
		super(); // call super before accessing this
		this.innerHTML = `
			<div class="alert-icon"></div>
			<div class="alert-text"></div>
			<div class="alert-close"><i class="fas fa-times"></i></div>`;
		this.children[2].addEventListener("click", this.close); // add close click event
	}

	close = () => this.classList.remove("active"); // hide alert
	isActive = () => this.classList.contains("active"); // check if alert is visible

	isOk = () => (this.isActive() && this.classList.contains("alert-success")); // check if alert is success type
	isInfo = () => (this.isActive() && this.classList.contains("alert-info")); // check if alert is info type
	isWarn = () => (this.isActive() && this.classList.contains("alert-warn")); // check if alert is warning type
	isError = () => (this.isActive() && this.classList.contains("alert-error")); // check if alert is error type

	#setAlert(type, icon, message) {
		this.className = `alert alert-${type} active`;
		this.children[0].innerHTML = icon; // set icon
		this.children[1].innerText = i18n.msg(message); // set text
	}
	setOk(message) { this.#setAlert("success", '<i class="fas fa-check-circle fa-2x"></i>', message); }
	setInfo(message) { this.#setAlert("info", '<i class="fas fa-info fa-3x"></i>', message); }
	setWarn(message) { this.#setAlert("warn", '<i class="fas fa-exclamation-triangle fa-2x"></i>', message); }
	setError(message) { this.#setAlert("error", '<i class="fas fa-exclamation fa-3x"></i>', message); }
}

// auto define custom element after class definition
customElements.define("alert-box", Alert, { extends: "div" });
