
function DomBox() {
	const self = this; //self instance
	const divNull = document.createElement("div");

	this.isMediaXs = () => (window.innerWidth < 576);
	this.ismediaSm = () => (window.innerWidth < 768);
	this.ismediaMd = () => (window.innerWidth < 992);
	this.ismediaLg = () => (window.innerWidth < 1200);
	this.isMediaXl = () => (window.innerWidth > 1199);

	this.$1 = (el, selector) => (el && el.querySelector(selector));
	this.$$ = (el, selector) => (el && el.querySelectorAll(selector));

	this.focus = el => { el && el.focus(); return self; }
	this.getAttr = (el, name) => (el && el.getAttribute(name));
	this.setAttr = (el, name, value) => { el && el.setAttribute(name, value); return self; }
	this.delAttr = (el, name) => { el && el.removeAttribute(name); return self; }
    this.render = (el, data, i, size) => { el && el.render(data, i, size); return self; }
	this.empty = el => (!el || !el.innerHTML || (el.innerHTML.trim() === ""));

	this.addClass = (el, name) => { el && el.classList.add(name); return self; }
	this.removeClass = (el, name) => { el && el.classList.remove(name); return self; }

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
		el && el.addEventListener(name, ev => fn(ev, el));
		return self; // self instance
	}

	this.ready = fn => document.addEventListener("DOMContentLoaded", fn);
	this.onClick = (el, fn) => fnAddEvent(fnQuery(el), "click", fn);
	this.addClick = self.onClick; // synonym
	this.setClick = (el, fn) => {
		el = fnQuery(el); // search for element
		if (el) // checks if element exists
			el.onclick = ev => fn(ev, el);
		return self;
	}

    this.onChange = (el, fn) => fnAddEvent(fnQuery(el), "change", fn);
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
		el.addEventListener("change", () => fnLoad(index));
		return self; // self instance
	}

	// Helper DOM elements
	this.getDivNull = () => divNull; // readonly element
	this.copyToClipboard = str => { // new 
		navigator.clipboard.writeText(str).then(() => {
			console.log("Text copied to clipboard!");
		}).catch(err => {
			console.error("Error copying text to clipboard:", err);
		});
		return self;
	}
}

export default new DomBox();
