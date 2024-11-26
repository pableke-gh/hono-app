
function oldCopyToClipboard(str) { // deprecated
	TEXT.value = str;
	TEXT.select(); //select text
	document.execCommand("copy");
}
function copyToClipboard(str) { // new
	navigator.clipboard.writeText(str).then(() => {
		console.log("Text copied to clipboard!");
	}).catch(err => {
		console.error("Error copying text to clipboard:", err);
	});
}

const divNull = document.createElement("div");
const TEXT = document.createElement("textarea");
const fnClipboard = (typeof navigator.clipboard === "undefined") ? oldCopyToClipboard : copyToClipboard;

function DomBox() {
	const self = this; //self instance

	this.focus = el => { el && el.focus(); return self; }
	this.getAttr = (el, name) => el && el.getAttribute(name);
	this.setAttr = (el, name, value) => { el && el.setAttribute(name, value); return self; }
	this.delAttr = (el, name) => { el && el.removeAttribute(name); return self; }
    this.render = (el, data, i, size) => { el && el.render(data, i, size); return self; }
	this.empty = el => !el || !el.innerHTML || (el.innerHTML.trim() === "");

	this.setval = (el, value) => { // el must exists
		if ((el.tagName == "SELECT") && !value)
			el.selectedIndex = 0;
		else
			el.value = value || ""; // String
		return self;
	}
    this.setValue = (el, value) => el ? self.setval(el, value) : self;
    this.getValue = el => el?.value;

    this.getText = el => el?.innerText;
    this.text = (el, text) => {
        if (el)
            el.innerText = text;
        return self;
    }

    this.getHtml = el => el?.innerHTML;
    this.html = (el, html) => {
        if (el)
            el.innerHTML = html;
        return self;
    }

	this.getOptionText = select => { // get current option text from select-box
        return select && select.options[select.selectedIndex]?.innerHTML;
	}

	// Events handlers
	const fnQuery = el => globalThis.isstr(el) ? $1(el) : el;
	const fnAddEvent = (el, name, fn) => {
		el.addEventListener(name, ev => fn(ev, el));
		return self; // self instance
	}
	const fnAddChange = (el, fn) => fnAddEvent(el, "change", fn);

	this.ready = fn => document.addEventListener("DOMContentLoaded", fn);
	this.onClick = (el, fn) => {
		el = fnQuery(el); // search for element
		return el ? fnAddEvent(el, "click", fn) : self;
	}
	this.addClick = self.onClick; // synonym
	this.setClick = (el, fn) => {
		el = fnQuery(el); // search for element
		if (el) // checks if element exists
			el.onclick = ev => fn(ev, el);
		return self;
	}

    this.onChange = (el, fn) => {
		el = fnQuery(el); // search for element
		return el ? fnAddChange(el, fn) : self;
	}
	this.addChange = this.onChange; // synonym
	this.setChange = (el, fn) => {
		el = fnQuery(el); // search for element
		if (el) // checks if element exists
			el.onchange = ev => fn(ev, el);
		return self;
	}
	this.onChangeFile = (el, fn) => {
		el = fnQuery(el); // search for element
        if (!el) // checks if element exists
            return self; // not exists

        let file, index = 0; // file, position;
		const reader = new FileReader();
		const fnLoad = i => {
			file = el.files[i]; // multifile
			file && reader.readAsArrayBuffer(file); //reader.readAsText(file, "UTF-8");
		}
		reader.onload = ev => { // event on load file
			fn(el, file, reader.result, index);
			fnLoad(++index);
		}
		return fnAddChange(el, () => fnLoad(index));
	}

	// Helper DOM elements
	this.getDivNull = () => divNull; // readonly element
	this.copyToClipboard = fnClipboard; // to clipboard
	this.ready(() => { // deprecated
		TEXT.style.position = "absolute";
		TEXT.style.left = "-9999px";
		document.body.prepend(TEXT);
	});
}

export default new DomBox();
