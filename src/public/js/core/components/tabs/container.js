
import alerts from "../alerts/Alerts.js";

class Tabs {
	#tabs = []; // all tabs
	#events = {}; // handlers for events

	getAction = name => this.#events[name]; // get event handler
	setAction = (name, fn) => { this.#events[name] = fn; return this; } // set event handler
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
	isLoaded = tab => this.getTab(tab).isLoaded(); // check if tab is preloaded

	#show(tab) {
		if (!tab.isLoaded()) // init event indicator
			tab.init(); // Fire once when show tab
		tab.view(); // fires always when show tab
		this.#tabs.forEach(tab => tab.setInactive()); // hide all tabs
		tab.setActive(); // active current tab only
		window.parent.scrollTo({ top: 0, behavior: "smooth" });
		return this;
	}
	show(id) {
		const tab = this.getTab(id); // destination tab
		const current = this.getCurrent(); // source tab
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
