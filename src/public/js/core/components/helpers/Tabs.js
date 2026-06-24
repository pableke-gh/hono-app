
import alerts from "./Alerts.js";
import Tab from "./Tab.js";
import cv from "../../../components/cv/Resize.js";

class Tabs {
	#tabs = []; // all tabs
	#events = {}; // handlers for events

	getAction = name => this.#events[name]; // get event handler
	setAction = (name, fn) => { this.#events[name] = fn; return this; } // set event handler
	setInitEvent = (tab, fn) => this.setAction("init-tab-" + tab, fn);
	setViewEvent = (tab, fn) => this.setAction("view-tab-" + tab, fn);
	invoke = (name, param) => {
		const fn = this.getAction(name);
		return fn ? fn(param) : true; // optional handler
	}

	size() { return this.#tabs.length; }
	isEmpty() { return this.#tabs.length === 0; }

	getTabs = () => this.#tabs; // tabs array
	add(tab) { this.#tabs.push(tab); } // append new tab
	getTab = id => this.#tabs.find(tab => (tab.id === ("tab-" + id))); // Find by id selector
	getCurrent = () => this.#tabs.find(tab => tab.isActive()); // current tab
	indexOf = tab => this.#tabs.indexOf(tab); // index of single tab
	isActive = tab => this.getTab(tab).isActive(); // check if tab is active
	setHeight = () => cv.setHeight(this.getCurrent()); // current tab height

	#show(tab) {
		if (!tab.dataset.loaded) // init event indicator
			this.invoke("init-" + tab.id, tab); // Fire once when show tab
		tab.dataset.loaded = "1"; // avoid to fire event again
		this.#tabs.forEach(tab => tab.setInactive()); // hide all tabs
		this.invoke("view-" + tab.id, tab); // fires always when show tab
		tab.setActive(); // active current tab only
		cv.resize(tab); // resize iframe height
		return this;
	}
	show(id) {
		const tab = this.getTab(id); // destination tab
		const current = this.getCurrent();
		if (current !== tab) // are different => move to new tab
			tab.dataset.back = this.indexOf(current); // set back index for current tab
		return this.#show(tab); // show new tab
	}
	next1(tab) {
		const index = this.indexOf(tab || this.getCurrent());
		return this.#show(this.#tabs[index + 1] || this.#tabs[index]);
	}
	next(id) {
		return globalThis.isset(id) ? this.show(id) : this.next1();
	}
	prev() {
		alerts.close();
		const tab = this.getCurrent();
		const index = tab.dataset.back ? +tab.dataset.back : (this.indexOf(tab) - 1);
		return this.#show(this.#tabs[index] || this.#tabs[0]);
	}

	showInit = () => this.show("init"); // show init view
	showForm = () => this.show("form"); // show form view
	showList = () => this.show("list"); // show list view
}

export default new Tabs(); // singleton instance

// define custom element after Tabs initialization to avoid circular dependency
customElements.define("tab-content", Tab, { extends: "div" });
