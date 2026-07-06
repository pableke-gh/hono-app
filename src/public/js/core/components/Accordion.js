
import i18n from "../i18n/langs.js";
import cv from "../../components/cv/Resize.js";

export default class Accordion extends HTMLDivElement {
	#data; // data container
	#opts = { // default options
		msgEmpty: "noResults", // default empty table message
		tplEmpty: `<p class="notice notice-warn">${i18n.get("noResults")}</p>`
	};

	getName = () => "accordion"; // default name for accordion
	setOptions = data => { Object.assign(this.#opts, data); return this; }
	setTplEmpty = html => { this.#opts.tplEmpty = html; return this; }
	setMsgEmpty = msg => this.setTplEmpty(`<p class="notice notice-warn">${i18n.get(msg)}</p>`);

	getData = () => this.#data;
	restart() { this.#opts.index = this.#opts.count = this.#opts.size = 0; return this; }
	setData(data) { this.#data = data; this.innerHTML = ""; return this.restart(); }

	hide() { this.classList.add("hide"); }
	show() { this.classList.remove("hide"); }
	setVisible(visible) { visible ? this.show() : this.hide(); }

	size() { return this.#data ? this.#data.length : 0; }
	isEmpty() { return !this.#data; }
	isLoaded() { return !!this.#data; }
	reset() { this.hide(); this.#data = null; }

	onOpen() {} // optional open envent
	#eventToggle(details) {
		details.addEventListener("toggle", ev => {
			if (!ev.target.open) return; // close action => skip
			const fnToggle = el => el.toggleAttribute("open", ev.target == el);
			this.querySelectorAll("details").forEach(fnToggle); // Close all other tabs
			this.onOpen(ev.target); // call open handler
			cv.setHeight(); // resize iframe for CV
		}, true); // set useCapture parameter to true
	}

	beforeTab(data, i) { this.#opts.index = i; this.#opts.count = i + 1; }
	summary(data, status) { } // build title for each tab
	body(body, data, status) { } // optional event

	renderTabs() { // vector
		this.#opts.size = this.#data.length; // data length
		if (this.#opts.size == 0) // empty data
			return this.insertAdjacentHTML("beforeend", this.#opts.tplEmpty);
		this.#data.forEach((row, i) => { // render each tab
			this.beforeTab(row, i); // update status parameters
			const details = document.createElement("details"); // create details element
			const summary = details.appendChild(document.createElement("summary")); // append summary as header
			const body = details.appendChild(document.createElement("div")); // append body after summary
			this.#eventToggle(details); // add event listener
			this.appendChild(details); // append new details to accordion
			this.summary(summary, row, this.#opts); // set summary contents
			this.body(body, row, this.#opts); // set body contents
		});
	}

	renderGroup(data) { // single level tabs
		this.restart(); // reset status parameters for each group
		data = data || this.#data; // use provided data or default data
		// Calling sort() without arguments sorts strings lexicographically
		Object.keys(data).sort().forEach((name, i) => { // render each tab
			const rows = data[name]; // get rows for the current group
			this.beforeTab(rows, i); // update status parameters
			const details = document.createElement("details"); // create details element
			const summary = details.appendChild(document.createElement("summary")); // append summary as header
			const body = details.appendChild(document.createElement("div")); // append body after summary
			this.#eventToggle(details); // add event listener
			this.appendChild(details); // append new details to accordion
			this.summary(summary, name, this.#opts); // set summary contents
			this.body(body, rows, this.#opts); // set body contents
		});
	}

	headerGroup(key) { }
	renderTree() { // multilevel = 2
		for (const key in this.#data) {
			this.headerGroup(key);
			this.renderGroup(this.#data[key]);
		}
		return this;
	}
}
