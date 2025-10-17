
import coll from "./CollectionHTML.js";
import i18n from "../i18n/langs.js";
import cv from "./cv/Resize.js";

export default function Accordion(opts) {
	opts = opts || {}; // default options
	opts.msgEmpty = opts.msgEmpty || "noResults"; // default empty table message
	opts.tplEmpty = opts.tplEmpty || `<p class="notice notice-warn">${i18n.get(opts.msgEmpty)}</p>`;
	opts.onRender = opts.onRender || globalThis.void;
	opts.onOpen = opts.onOpen || globalThis.void;

	const self = this; //self instance
	const template = document.createElement("template");
	let _data; // data container

	this.setTplEmpty = html => { opts.tplEmpty = html; return self; }
	this.setMsgEmpty = msg => self.setTplEmpty(`<p class="notice notice-warn">${i18n.get(msg)}</p>`);
	this.setRender = fn => { opts.onRender = fn; return self; }
	this.setOpen = fn => { opts.onOpen = fn; return self; }

	const fnToggle = parent => {
		parent.childNodes.forEach((details, i) => { // add toggle listeners to each details element
			details.openings = 0;
			const fnToggle = ev => {
				if (!ev.target.open)
					return; // close action
				opts.onOpen(_data[i], ev.target, i); // call open handler
				//details.eachSibling(el => el.removeAttribute("open")); // only one open
				ev.target.openings++; // number of openings
			}
			// set useCapture parameter to true
			details.addEventListener("toggle", fnToggle, true);
			cv.setHeight(); // resize iframe
		});
		cv.setHeight(); // resize iframe
		return self;
	}

	this.setData = data => {
		_data = data; // set container
		const size = coll.size(data); // data length
		template.innerHTML = size ? coll.render(data, opts.onRender) : opts.tplEmpty; // stringify
		return self;
	}
    this.setItems = items => {
		_data = items; // set container
		const size = coll.size(items); // data length
		const fnRender = item => `<details><summary>${item.label}</summary></details>`;
		template.innerHTML = size ? items.map(fnRender).join("") : opts.tplEmpty; // stringify
		return self;
	}
	this.setLabels = labels => {
		_data = labels; // set container
		const size = coll.size(labels); // data length
		const fnRender = label => `<details><summary>${label}</summary></details>`;
		template.innerHTML = size ? labels.map(fnRender).join("") : opts.tplEmpty; // stringify
		return self;
	}

	this.append = parent => {
		parent = globalThis.isstr(parent) ? $1(parent) : parent;
		parent.appendChild(document.importNode(template.content, true));
		return fnToggle(parent);
	}
	this.replace = parent => {
		parent = globalThis.isstr(parent) ? $1(parent) : parent;
		parent.replaceChildren(document.importNode(template.content, true));
		return fnToggle(parent);
	}
}
