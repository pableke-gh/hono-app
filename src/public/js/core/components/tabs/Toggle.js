
import sb from "../../../components/types/StringBox.js";

export default class ToggleLink extends HTMLAnchorElement {
	#clicks = 0;

	init() {}
	view() {}

	getNumClicks = () => this.#clicks;
	getNumOpens = () => (this.#clicks / 2);
	isClose = () => ((this.#clicks % 2) == 0);
	isOpen = () => ((this.#clicks % 2) == 1);

	#toggle() {
		this.#clicks++; // increment counter
		const icon = this.querySelector(this.dataset.icon || "i"); // icon indicator
		sb.split(this.dataset.toggle, " ").forEach(name => icon.classList.toggle(name));
		const target = document.querySelector(this.dataset.target || (".tab-" + this.id));
		target.classList.toggle("hide"); // target must exists
	}
	execute() {
		if (!this.#clicks)
			this.init();
		if (this.isClose())
			this.view();
		this.#toggle();
	}
	open() {
		this.isClose() && this.#toggle();
	}

	connectedCallback() {
		this.addEventListener("click", ev => {
			ev.preventDefault();
			this.execute();
		});
	}
}
