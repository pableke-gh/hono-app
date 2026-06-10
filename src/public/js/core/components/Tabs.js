
class Tabs {
	#tabs = []; // all tabs

	size() { return this.#tabs.length; }
	isEmpty() { return this.#tabs.length === 0; }

	getTabs = () => this.#tabs; // tabs array
	add(tab) { this.#tabs.push(tab); }
	getTabByIndex = index => this.#tabs[index]; // Find by index
	getTab = id => this.#tabs.find(tab => (tab.id === ("tab-" + id))); // Find by id selector
	getCurrent = () => this.#tabs.find(tab => tab.isActive()); // current tab
	indexOf = tab => this.#tabs.indexOf(tab); // index of single tab

	show(index) {
		index = index || 0; // default to 0
		index = (index < 1) ? 0 : Math.min(index, this.#tabs.length - 1); // limit range
		this.#tabs.forEach(tab => tab.setInactive());
		this.#tabs[index].setActive();
	}
	next(id) {
		const source = globalThis.isset(id) ? this.getTab(id) : this.getCurrent(); // get tab by id or current
		tabs.show(this.indexOf(source) + 1);
	}
	prev() { tabs.show(tabs.indexOf(this) - 1); }
}

const tabs = new Tabs(); // singleton instance

class Tab extends HTMLDivElement {
	constructor() {
		super();
		tabs.add(this); // add to tabs container
		this.classList.add("tab-content");
	}

	isActive() { return this.classList.contains("active"); } // is current tab
	setActive() { this.classList.add("active"); } // update style to show tab
	setInactive() { this.classList.remove("active"); } // update style to hide tab

	next() { tabs.show(tabs.indexOf(this) + 1); }
	prev() { tabs.show(tabs.indexOf(this) - 1); }
}

customElements.define("tab-content", Tab, { extends: "div" });

export default tabs;
