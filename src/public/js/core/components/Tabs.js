
import alerts from "./Alerts.js";
import Tab from "./Tab.js";

class Tabs {
	#tabs = []; // all tabs

	size() { return this.#tabs.length; }
	isEmpty() { return this.#tabs.length === 0; }

	getTabs = () => this.#tabs; // tabs array
	add(tab) { this.#tabs.push(tab); } // append new tab
	getTab = id => this.#tabs.find(tab => (tab.id === ("tab-" + id))); // Find by id selector
	getCurrent = () => this.#tabs.find(tab => tab.isActive()); // current tab
	indexOf = tab => this.#tabs.indexOf(tab); // index of single tab

	#show(tab) {
		this.#tabs.forEach(tab => tab.setInactive());
		tab.setActive();
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
}

export default new Tabs(); // singleton instance

// define custom element after Tabs initialization to avoid circular dependency
customElements.define("tab-content", Tab, { extends: "div" });
