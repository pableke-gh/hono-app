
import sb from "../../../components/types/StringBox.js";
import ActionLink from "./Action.js";

export default class ToggleLink extends ActionLink {
	#clicks = 0;

	init() {}
	beforeOpen() {}
	afterOpen() {}
	afterClose() {}

	getNumClicks = () => this.#clicks;
	getNumOpens = () => (this.#clicks / 2);
	isClose = () => ((this.#clicks % 2) == 0);
	isOpen = () => ((this.#clicks % 2) == 1);

	#toggle() {
		this.#clicks++; // increment counter
		const icon = this.querySelector(this.dataset.icon || "i"); // icon indicator
		sb.split(this.dataset.toggle, " ").forEach(name => icon.classList.toggle(name));
		const target = this.dataset.target || (".info-" + this.getAttribute("id"));
		document.querySelectorAll(target).forEach(el => el.classList.toggle("hide"));
		if (this.dataset.focus) // set focus input
			this.closest("form").elements[this.dataset.focus].focus();
	}
	#setOpen() {
		this.beforeOpen();
		this.#toggle();
		this.afterOpen();
	}
	#setClose() {
		this.#toggle();
		this.afterClose();
	}

	open() { this.isClose() && this.#setOpen(); }
	close() { this.isOpen() && this.#setClose(); }
	execute() {
		if (!this.#clicks)
			this.init();
		if (this.isClose())
			this.#setOpen();
		else
			this.#setClose();
	}
}
