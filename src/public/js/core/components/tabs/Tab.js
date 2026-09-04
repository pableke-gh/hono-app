
import tabs from "./container.js";
import alerts from "../alerts/Alerts.js";

export default class Tab extends HTMLDivElement {
	#loaded; #index; #back; #forward;

	isActive() { return this.classList.contains("active"); } // is current tab
	setActive() { this.classList.add("active"); } // update style to show tab
	setInactive() { this.classList.remove("active"); } // update style to hide tab

	isLoaded = () => this.#loaded; // check if tab is loaded
	isForward = () => this.#forward; // tab go forward
	init() { this.#loaded = true; } // mark tab as loaded
	beforeView() { return true; } // optional event fire before tab si visible
	afterView() { } // optional event fire when tab is visible

	getIndex = () => this.#index; // get index of tab in container
	setIndex(index) { this.#index = index; } // set index of tab in container
	getBack = () => this.#back; // get back tab (for prev/back navigation)
	setBack(tab) { this.#back = tab; } // set back back tab (for prev/back navigation)

	#show(tab) {
		this.#forward = tab.getIndex() > this.#index;
		if (this.isForward()) // forward => set back tab
			tab.setBack(this); // set back tab for destination tab
		if (!tab.beforeView(this)) // fires always before tab is visible
			return; // stop => avoid change tab
		if (!tab.isLoaded()) // init event indicator
			tab.init(); // Fire once when show tab
		tabs.setInactive(); // hide current tab
		tab.setActive(); // active current tab only
		window.parent.scrollTo({ top: 0, behavior: "smooth" });
		tab.afterView(); // fires always when tab is visible
	}
	open() { this.#show(this); } // show current tab
	show(id) { this.#show(tabs.getTab(id)); }
	view(id) { this.show(id); }

	prev1() {
		alerts.close(); // remove alerts
		this.#show(this.getBack() || tabs.at(Math.max(this.#index - 1, 0)));
	}
	prev(id) { // go to destination tab by id or previous
		globalThis.isset(id) ? this.show(id) : this.prev1();
	}
	back(id) {
		this.prev(id);
	}

	next1() { // go to next tab
		this.#show(tabs.at(this.#index + 1));
	}
	next(id) { // go to destination tab by id or next
		globalThis.isset(id) ? this.show(id) : this.next1();
	}

	showInit() { this.show("init"); } // show init view
	showForm() { this.show("form"); } // show form view
	showList() { this.show("list"); } // show list view

	connectedCallback() { // Init. component when added to DOM
		this.classList.add("tab-content"); // default class for all tabs
	}
}
