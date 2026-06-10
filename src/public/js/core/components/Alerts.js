
class Alerts {
	#alerts = []; // container for alert instances

	add(alert) { this.#alerts.push(alert); } // add alert instance to container
	close() { this.#alerts.forEach(alert => alert.close()); } // hide all alerts
	isOk() { return this.#alerts[0].isOk() && !this.#alerts[1].isError(); } // check if first alert is success
	isError() { return this.#alerts.some(alert => alert.isError()); } // check if any alert is error type

	setOk(message) {
		const alert = this.#alerts.at(-1); // get alert element
		alert.setOk(message); // set message and style
		alert.parentNode.prepend(alert); // move alert to top
	}
	setInfo(message) {
		const alert = this.#alerts.at(-1);
		alert.setInfo(message);
		alert.parentNode.prepend(alert);
	}
	setWarn(message) {
		const alert = this.#alerts.at(-1);
		alert.setWarn(message);
		alert.parentNode.prepend(alert);
	}
	setError(message) {
		const alert = this.#alerts.at(-1);
		alert.setError(message);
		alert.parentNode.prepend(alert);
	}
}

const alerts = new Alerts(); // singleton instance

class Alert extends HTMLDivElement {
	constructor() {
		super(); // always call super() first in constructor
		this.innerHTML = `
			<div class="alert-icon"></div>
			<div class="alert-text"></div>
			<div class="alert-close"><i class="fas fa-times"></i></div>`;

		alerts.add(this); // add this alert instance to alerts container
		this.children[2].addEventListener("click", this.close); // add close event
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
		this.children[1].innerText = message; // set text
	}
	setOk(message) { this.#setAlert("success", '<i class="fas fa-check-circle fa-2x"></i>', message); }
	setInfo(message) { this.#setAlert("info", '<i class="fas fa-info fa-3x"></i>', message); }
	setWarn(message) { this.#setAlert("warn", '<i class="fas fa-exclamation-triangle fa-2x"></i>', message); }
	setError(message) { this.#setAlert("error", '<i class="fas fa-exclamation fa-3x"></i>', message); }
}

customElements.define("alert-box", Alert, { extends: "div" });

export default alerts;
