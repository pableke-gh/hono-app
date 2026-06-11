
import Alert from "./Alert.js";

class Alerts {
	#alerts; // html element

	add(alert) { this.#alerts = alert.parentNode; } // add alert instance to container
	close() { Array.from(this.#alerts.children).forEach(alert => alert.close()); return this; } // hide all alerts
	isOk() { return !this.isError() && Array.from(this.#alerts.children).some(alert => alert.isOk()); } // check if first alert is success
	isError() { return Array.from(this.#alerts.children).some(alert => alert.isError()); } // check if any alert is error type

	addOk(message) {
		if (message) { // add only if message is not empty
			const alert = this.#alerts.lastElementChild; // get alert element
			alert.setOk(message); // set message and style
			this.#alerts.prepend(alert); // move alert to top
		}
		return this; // for chaining
	}
	setOk(message) { // close all alerts and add success alert
		return this.close().addOk(message);
	}

	addInfo(message) {
		if (message) { // add only if message is not empty
			const alert = this.#alerts.lastElementChild;
			alert.setInfo(message); // set message and style
			this.#alerts.prepend(alert);
		}
		return this; // for chaining
	}
	setInfo(message) { // close all alerts and add info alert
		return this.close().addInfo(message);
	}

	addWarn(message) {
		if (message) { // add only if message is not empty
			const alert = this.#alerts.lastElementChild;
			alert.setWarn(message); // set message and style
			this.#alerts.prepend(alert);
		}
		return this; // for chaining
	}
	setWarn(message) { // close all alerts and add warn alert
		return this.close().addWarn(message);
	}

	addError(message) {
		if (message) { // add only if message is not empty
			const alert = this.#alerts.lastElementChild;
			alert.setError(message); // set message and style
			this.#alerts.prepend(alert);
		}
		return this; // for chaining
	}
	setError(message) { // close all alerts and add error alert
		return this.close().addError(message);
	}

	show(messages) { // show multiple alerts at once
		this.close(); // close all existing alerts
		if (messages) { // messages can be empty or null
			const { ok, info, warn, error } = messages; // extract messages by type
			this.addOk(ok).addInfo(info).addWarn(warn).addError(error);
		}
		return this; // for chaining
	}
}

export default new Alerts(); // singleton instance

// define custom element after Alerts initialization to avoid circular dependency
customElements.define("alert-box", Alert, { extends: "div" });
