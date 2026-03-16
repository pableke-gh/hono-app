
import coll from "./CollectionHTML.js";
import i18n from "../i18n/langs.js";
import cv from "./cv/Resize.js";

export default class AccordionHTML extends HTMLDivElement {
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
	getTabs = () => this.children;

	onOpen() {} // optional onOpen envent
	beforeTab() {} // fired before render each tab (optional)
	render() { throw new Error("Method 'render' must be implemented."); } // required render function

	#precalc = (row, i) => {
		this.#opts.index = i;
		this.#opts.count = i + 1;
		this.beforeTab(row, this.#opts);
		return this;
	}
	#eventToggle = () => { // add toggle listeners to each details element
		this.childNodes.forEach((details, i) => {
			details.openings = 0; // init. counter
			details.addEventListener("toggle", ev => {
				if (!ev.target.open) // fired after update open prop
					return; // close action
				this.onOpen(this.#data[i], ev.target, i); // call open handler
				details.eachSibling(el => el.removeAttribute("open")); // only one open
				ev.target.openings++; // number of openings
				cv.setHeight(); // resize iframe for CV
			}, true); // set useCapture parameter to true
		});
		return this;
	}

	setData = data => {
		this.#data = data; // set container
		this.#opts.size = coll.size(data); // data length
		const fnRender = (row, i) => this.#precalc(row, i).render(row, this.#opts);
		this.innerHTML = this.#opts.size ? data.map(fnRender).join("") : this.#opts.tplEmpty;
		return this.#eventToggle(); // add event listener
	}
	setItems = items => {
		this.#data = items; // set container
		const size = coll.size(items); // data length
		const fnRender = item => `<details><summary>${item.label}</summary></details>`;
		this.innerHTML = size ? items.map(fnRender).join("") : this.#opts.tplEmpty;
		return this.#eventToggle(); // add event listener
	}
	setLabels = labels => {
		this.#data = labels; // set container
		const size = coll.size(labels); // data length
		const fnRender = label => `<details><summary>${label}</summary></details>`;
		this.innerHTML = size ? labels.map(fnRender).join("") : this.#opts.tplEmpty;
		return this.#eventToggle(); // add event listener
	}
}
