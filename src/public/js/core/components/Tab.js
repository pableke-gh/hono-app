
import tabs from "./Tabs.js";

export default class Tab extends HTMLDivElement {
	isActive() { return this.classList.contains("active"); } // is current tab
	setActive() { this.classList.add("active"); } // update style to show tab
	setInactive() { this.classList.remove("active"); } // update style to hide tab

	next() { tabs.next1(this); }
	prev() { tabs.prev(); }

	connectedCallback() { // Init. component when added to DOM
		tabs.add(this); // add this to container (after instance tabs to avoid circular dependency)
		this.classList.add("tab-content"); // default class for all tabs

		// set handlers for navigation
		this.querySelectorAll("a[href^='#tab-']").forEach(link => {
			link.addEventListener("click", ev => {
				const href = link.getAttribute("href");
				if ((href == "#tab-back") || (href == "#tab-prev"))
					this.prev();
				else if (href == "#tab-next")
					this.next();
				else
					tabs.show(href.substring(href.lastIndexOf("-") + 1));
			});
		});
	}
}

document.addEventListener("DOMContentLoaded", () => {
	// define custom element after Tabs initialization to avoid circular dependency
	customElements.define("tab-content", Tab, { extends: "div" });
});
