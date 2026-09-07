
import alerts from "../alerts/Alerts.js";

class Tabs {
	#tabs; // all tabs

	constructor() {
		document.addEventListener("DOMContentLoaded", () => {
			this.#tabs = document.querySelectorAll(".tab-content"); // all tabs
			this.#tabs.forEach((tab, index) => tab.setIndex(index)); // set position
		});
	}

	size() { return this.#tabs.length; }
	isEmpty() { return this.#tabs.length === 0; }

	getTabs = () => this.#tabs; // tabs array
	add(tab) { this.#tabs.push(tab); } // append new tab
	at = index => this.#tabs.at(index); // get tab by position
	getTab = id => this.#tabs.find(tab => (tab.id === ("tab-" + id))); // Find by id selector
	getCurrent = () => this.#tabs.find(tab => tab.isActive()); // current tab
	indexOf = tab => this.#tabs.indexOf(tab); // index of single tab
	isActive = tab => this.getTab(tab).isActive(); // check if tab is active
	isLoaded = tab => this.getTab(tab).isLoaded(); // check if tab is preloaded
	setInactive() { this.#tabs.forEach(tab => tab.setInactive()); }

	open(id) { this.#tabs[0].show(id); return this; }
	show(id) { this.getCurrent().show(id); return this; }
	view(id) { return this.show(id); } // synonym of show function

	prev(id) { this.getCurrent().prev(id); return this; }
	back(id) { return this.prev(id); } // synonym of prev function
	next(id) { this.getCurrent().next(id); return this; }

	showOk(msg) { alerts.setOk(msg); } // set ok alert
	showInfo(msg) { alerts.setInfo(msg); } // set info alert
	showWarn(msg) { alerts.setWarn(msg); } // set warn alert
	showError(msg) { alerts.setError(msg); } // set error alert

	showInit = () => this.show("init"); // show init view
	showForm = () => this.show("form"); // show form view
	showList = () => this.show("list"); // show list view
}

export default new Tabs(); // singleton instance
