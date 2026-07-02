
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

	hide() { this.classList.add("hide"); }
	show() { this.classList.remove("hide"); }
	setVisible(visible) { visible ? this.show() : this.hide(); }

	onOpen() {} // optional onOpen envent
	restart() { this.#opts.index = this.#opts.count = this.#opts.size = 0; return this; }
	setData(data) { this.#data = data; this.innerHTML = ""; return this.restart(); }

	#eventToggle() {
		const tabs = this.querySelectorAll("details"); // get all details elements
		tabs.forEach((details, i) => { // add toggle listeners to each details element
			details.addEventListener("toggle", ev => {
				if (!ev.target.open) return; // close action => skip
				tabs.forEach(el => el.toggleAttribute("open", ev.target == el)); // Close all other panels
				this.onOpen(ev.target, i); // call open handler
				cv.setHeight(); // resize iframe for CV
			}, true); // set useCapture parameter to true
		});
		return this;
	}

	beforeTab(i) { this.#opts.index = i; this.#opts.count = i + 1; }
	summary(data, status) { } // build title for each tab
	afterTab(tab, data, status) { } // optional event

	renderTabs() { // vector
		this.#opts.size = this.#data.length; // data length
		if (this.#opts.size == 0) // empty data
			return this.insertAdjacentHTML("beforeend", this.#opts.tplEmpty);
		this.#data.forEach((row, i) => { // render each tab
			this.beforeTab(i); // update status parameters
			const summary = document.createElement("summary"); // create summary element
			const details = document.createElement("details"); // create details element
			details.appendChild(summary); // append summary as header to details
			details.appendChild(document.createElement("div")); // append body container to details
			this.summary(summary, row, this.#opts); // set summary contents
			this.appendChild(details); // append details to accordion
			this.afterTab(details, row, this.#opts);
		});
		return this.#eventToggle(); // add event listener
	}

	renderGroup(data) { // single level tabs
		this.restart(); // reset status parameters for each group
		data = data || this.#data; // use provided data or default data
		// Calling sort() without arguments sorts strings lexicographically
		Object.keys(data).sort().forEach((name, i) => { // render each tab
			this.beforeTab(i); // update status parameters
			const summary = document.createElement("summary"); // create summary element
			const details = document.createElement("details"); // create details element
			details.appendChild(summary); // append summary as header to details
			details.appendChild(document.createElement("div")); // append body container to details
			this.summary(summary, name, this.#opts); // set summary contents
			this.appendChild(details); // append details to accordion
			this.afterTab(details, data[name], this.#opts); // event after tab is rendered
		});
		return this.#eventToggle(); // add event listener
	}

	headerGroup(key, status) { }
	renderTree() { // multilevel = 2
		for (const key in this.#data) {
			this.headerGroup(key, this.#opts);
			this.renderGroup(this.#data[key]);
		}
		return this;
	}
}
