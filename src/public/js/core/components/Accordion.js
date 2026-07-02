
import i18n from "../i18n/langs.js";
import cv from "../../components/cv/Resize.js";

export default class Accordion extends HTMLDivElement {
	#data; // data container
	#opts = { // default options
		msgEmpty: "noResults", // default empty table message
		tplEmpty: `<p class="notice notice-warn">${i18n.get("noResults")}</p>`
	};

	setOptions = data => { Object.assign(this.#opts, data); return this; }
	setTplEmpty = html => { this.#opts.tplEmpty = html; return this; }
	setMsgEmpty = msg => this.setTplEmpty(`<p class="notice notice-warn">${i18n.get(msg)}</p>`);

	size = () => this.#data.length;
	isEmpty = () => !this.#data.length;
	getFirst = () => this.#data[0];
	getLastItem = () => this.#data.at(-1);
	getTabs = () => (this.#opts.size ? this.childNodes : []);

	hide() { this.classList.add("hide"); }
	show() { this.classList.remove("hide"); }
	setVisible(visible) { visible ? this.show() : this.hide(); }

	onOpen() {} // optional onOpen envent
	beforeTab(data, i) { this.#opts.index = i; this.#opts.count = i + 1; } // optional event
	render() { throw new Error("Method 'render' must be implemented."); } // required render function

	#eventToggle = () => {
		const tabs = this.childNodes;
		tabs.forEach((details, i) => {
			// add toggle listeners to each details element
			details.addEventListener("toggle", ev => {
				if (!ev.target.open) return; // close action => skip
				tabs.forEach(el => el.toggleAttribute("open", ev.target == el)); // Close all other panels
				this.onOpen(this.#data[i], ev.target, i); // call open handler
				cv.setHeight(); // resize iframe for CV
			}, true); // set useCapture parameter to true
		});
		return this;
	}

	setData(data) {
		this.#data = data; // set container
		this.#opts.size = data ? data.length : 0; // data length
		const fnRender = (row, i) => { this.beforeTab(row, i); return this.render(row, this.#opts); }
		this.innerHTML = this.#opts.size ? data.map(fnRender).join("") : this.#opts.tplEmpty;
		return this.#eventToggle(); // add event listener
	}
}
