
import input from "./InputBox.js";

function DomBox() {
	const self = this; //self instance
	const divNull = document.createElement("div");

	this.isMediaXs = () => (window.innerWidth < 576);
	this.ismediaSm = () => ((575 < window.innerWidth) && (window.innerWidth < 768));
	this.ismediaMd = () => ((767 < window.innerWidth) && (window.innerWidth < 992));
	this.ismediaLg = () => ((991 < window.innerWidth) && (window.innerWidth < 1200));
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

	const fnSetValue = (el, value) => {
		input.setValue(el, value); // el must exists
		return self;
	}
    this.setValue = (el, value) => el ? fnSetValue(el, value) : self;
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

	this.isSelect = el => el && el.options;
	this.getOption = select => select && select.options[select.selectedIndex]; // get current option element
	this.getOptionText = select => self.getHtml(self.getOption(select)); // get current option text
	this.select = function(el, mask) {
		if (self.isSelect(el)) {
			const option = self.getOption(el); //get current option
			el.options.mask(mask); // update all options class
			if (option && option.isHidden()) // contains hide class
				el.selectedIndex = el.options.findIndexBy(":not(.hide)");
		}
		return self;
	}

	// Events handlers
	const fnQuery = el => globalThis.isstr(el) ? $1(el) : el;
	this.ready = fn => document.addEventListener("DOMContentLoaded", fn);
	this.addAction = (el, fn) => {
		if (el) // checks if element exists
			input.addClick(el, fn);
		return self;
	}
	this.onClick = (el, fn) => self.addAction(fnQuery(el), fn);
	this.addClick = self.onClick; // synonym
	this.setAction = (el, fn) => {
		if (el) // checks if element exists
			el.onclick = ev => fn(ev, el);
		return self;
	}
	this.setClick = (el, fn) => self.setAction(fnQuery(el), fn);

    this.onChange = (el, fn) => {
		if (el) // checks if element exists
			input.addChange(el, fn);
		return self; // self instance
	}
	this.addChange = this.onChange; // synonym
	this.setChange = (el, fn) => {
		el = fnQuery(el); // search for element
		if (el) // checks if element exists
			el.onchange = ev => fn(ev, el);
		return self;
	}

	this.onChangeFile = (el, fn) => { el && input.onChangeFile(el, fn); return self; }
	this.onChangeFiles = (data, fn) => { data.forEach(el => input.onChangeFile(el, fn)); return self; }

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
