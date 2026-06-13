
import Alert from "./Alert.js";

class Alerts extends HTMLDivElement {
	close() { this.children.forEach(alert => alert.close()); return this; } // hide all alerts
	isOk() { return !this.isError() && this.children.some(alert => alert.isOk()); } // check if first alert is success
	isError() { return this.children.some(alert => alert.isError()); } // check if any alert is error type

	addOk(message) {
		if (message) { // add only if message is not empty
			const alert = this.lastElementChild; // get alert element
			alert.setOk(message); // set message and style
			this.prepend(alert); // move alert to top
		}
		return this; // for chaining
	}
	setOk(message) { // close all alerts and add success alert
		return this.close().addOk(message);
	}

	addInfo(message) {
		if (message) { // add only if message is not empty
			const alert = this.lastElementChild;
			alert.setInfo(message); // set message and style
			this.prepend(alert);
		}
		return this; // for chaining
	}
	setInfo(message) { // close all alerts and add info alert
		return this.close().addInfo(message);
	}

	addWarn(message) {
		if (message) { // add only if message is not empty
			const alert = this.lastElementChild;
			alert.setWarn(message); // set message and style
			this.prepend(alert);
		}
		return this; // for chaining
	}
	setWarn(message) { // close all alerts and add warn alert
		return this.close().addWarn(message);
	}

	addError(message) {
		if (message) { // add only if message is not empty
			const alert = this.lastElementChild;
			alert.setError(message); // set message and style
			this.prepend(alert);
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

	loading = () => { this.nextElementSibling.classList.add("active"); this.close(); }
	working = () => this.nextElementSibling.classList.remove("active"); // animation = fadeOut
	top = () => window.scrollTo({ top: 0, behavior: "smooth" });

	connectedCallback() { // Init. component when added to DOM
		this.classList.add("alerts"); // add container class
		this.appendChild(new Alert()); // add first alert element
		this.appendChild(new Alert()); // add second alert element

		// append loadding and back-to-top elements
		this.insertAdjacentHTML("afterend", '<a id="back-to-top" href="#top" class="hide back-to-top"><i class="fas fa-arrow-up"></i></a>');
		this.insertAdjacentHTML("afterend", '<div class="loading"><b class="fas fa-circle-notch fa-3x fa-spin loading-content"></b></div>');

		const _top = this.nextElementSibling.nextElementSibling; // back-to-top element
		_top.addEventListener("click", ev => { this.top(); ev.preventDefault(); });
		window.onscroll = () => _top.classList.toggle("hide", window.scrollY < 85);
	}
}

customElements.define("alerts-box", Alerts, { extends: "div" });
// IMPORTANT! instance alerts after definition
const alerts = new Alerts(); // singleton instance
document.body.appendChild(alerts); // add alerts to body

// Extends HTMLCollection prototype
HTMLCollection.prototype.map = Array.prototype.map;
HTMLCollection.prototype.some = Array.prototype.some;
HTMLCollection.prototype.find = Array.prototype.find;
HTMLCollection.prototype.filter = Array.prototype.filter;
HTMLCollection.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.findIndex = Array.prototype.findIndex;
HTMLCollection.prototype.findLastIndex = Array.prototype.findLastIndex;

export default alerts; // singleton instance
