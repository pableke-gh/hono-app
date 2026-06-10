
class Alerts {
	#alerts; // html element

	add(alert) { this.#alerts = alert.parentNode; } // add alert instance to container
	close() { Array.from(this.#alerts.children).forEach(alert => alert.close()); return this; } // hide all alerts
	isOk() { return !this.isError() && Array.from(this.#alerts.children).some(alert => alert.isOk()); } // check if first alert is success
	isError() { return Array.from(this.#alerts.children).some(alert => alert.isError()); } // check if any alert is error type

	addOk(message) {
		const alert = this.#alerts.lastElementChild; // get alert element
		alert.setOk(message); // set message and style
		this.#alerts.prepend(alert); // move alert to top
		return this; // for chaining
	}
	setOk(message) { // close all alerts and add success alert
		return this.close().addOk(message);
	}

	addInfo(message) {
		const alert = this.#alerts.lastElementChild;
		alert.setInfo(message);
		this.#alerts.prepend(alert);
		return this; // for chaining
	}
	setInfo(message) { // close all alerts and add info alert
		return this.close().addInfo(message);
	}

	addWarn(message) {
		const alert = this.#alerts.lastElementChild;
		alert.setWarn(message);
		this.#alerts.prepend(alert);
		return this; // for chaining
	}
	setWarn(message) { // close all alerts and add warn alert
		return this.close().addWarn(message);
	}

	addError(message) {
		const alert = this.#alerts.lastElementChild;
		alert.setError(message);
		this.#alerts.prepend(alert);
		return this; // for chaining
	}
	setError(message) { // close all alerts and add error alert
		return this.close().addError(message);
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
