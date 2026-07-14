
import tabs from "./TabsContainer.js";

export default class Tab extends HTMLDivElement {
	isActive() { return this.classList.contains("active"); } // is current tab
	setActive() { this.classList.add("active"); } // update style to show tab
	setInactive() { this.classList.remove("active"); } // update style to hide tab

	isLoaded = () => this.dataset.loaded; // check if tab is loaded
	init() { this.dataset.loaded = "1"; } // mark tab as loaded
	view() { } // optional event when tab is shown (after init)

	next() { tabs.next1(this); }
	prev() { tabs.prev(); }

	connectedCallback() { // Init. component when added to DOM
		tabs.add(this); // add this to container (after instance tabs to avoid circular dependency)
		this.classList.add("tab-content"); // default class for all tabs

		// set handlers for navigation
		this.querySelectorAll("a[href^='#tab-']").forEach(link => {
			link.addEventListener("click", ev => {
				const href = link.getAttribute("href");
				const id = href.substring(href.lastIndexOf("-") + 1);
				if ((href == "#tab-back") || (href == "#tab-prev"))
					this.prev();
				else if (href == "#tab-next")
					this.next();
				else if (href.startsWith("#tab-action"))
					tabs.invoke(link.dataset.action || id, link); // call handler
				else
					tabs.show(id);
				ev.preventDefault(); // no navigate
			});
		});
	}
}
