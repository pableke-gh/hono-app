
import dom from "./forms/DomBox.js";
import coll from "./Collection.js";
import i18n from "../i18n/langs.js";

const HIDE_CLASS = "hide";
const divNull = document.createElement("div");

const fnHide = el => el.classList.add(HIDE_CLASS);
const fnShow = el => el.classList.remove(HIDE_CLASS);
const fnVisible = el => (el.offsetWidth || el.offsetHeight || el.getClientRects().length);

// Extends HTMLCollection prototype
HTMLCollection.prototype.map = Array.prototype.map;
HTMLCollection.prototype.find = Array.prototype.find;
HTMLCollection.prototype.filter = Array.prototype.filter;
HTMLCollection.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.eachPrev = Array.prototype.eachPrev;
HTMLCollection.prototype.findIndex = Array.prototype.findIndex;
HTMLCollection.prototype.findLastIndex = Array.prototype.findLastIndex;
HTMLCollection.prototype.findBy = function(selector) { return this.find(el => el.matches(selector)); }
HTMLCollection.prototype.findIndexBy = function(selector) { return this.findIndex(el => el.matches(selector)); }
HTMLCollection.prototype.filterBy = function(selector) { return this.filter(el => el.matches(selector)); }
HTMLCollection.prototype.refresh = function(data, opts) { this.forEach(el => el.refresh(data, opts)); }
HTMLCollection.prototype.html = function(text) { this.forEach(el => { el.innerHTML = text; }); return this; }
HTMLCollection.prototype.text = function(text) { this.forEach(el => { el.innerText = text; }); return this; }
HTMLCollection.prototype.addClick = function(fn) { this.forEach(el => el.addClick(fn)); };
HTMLCollection.prototype.setClick = function(fn) { this.forEach(el => el.setClick(fn)); };
HTMLCollection.prototype.hide = function() { this.forEach(fnHide); return this; }
HTMLCollection.prototype.show = function() { this.forEach(fnShow); return this; }
HTMLCollection.prototype.toggle = function(name, force) {
	this.forEach(el => el.classList.toggle(name, force));
	return this;
}
HTMLCollection.prototype.mask = function(flags, name) {
    if (!name) { // Toggle class name
        name = HIDE_CLASS; // Default = hide
        flags = ~flags; // Negate flags
    }
    this.forEach((el, i) => el.toggle(name, (flags >> i) & 1));
    return this;
}

// Extends NodeList prototype
NodeList.prototype.map = Array.prototype.map;
NodeList.prototype.find = Array.prototype.find;
NodeList.prototype.filter = Array.prototype.filter;
NodeList.prototype.eachPrev = Array.prototype.eachPrev;
NodeList.prototype.findIndex = HTMLCollection.prototype.findIndex;
NodeList.prototype.findLastIndex = HTMLCollection.prototype.findLastIndex;
NodeList.prototype.findBy = HTMLCollection.prototype.findBy;
NodeList.prototype.findIndexBy = HTMLCollection.prototype.findIndexBy;
NodeList.prototype.filterBy = HTMLCollection.prototype.filterBy;
NodeList.prototype.refresh = HTMLCollection.prototype.refresh;
NodeList.prototype.html = HTMLCollection.prototype.html;
NodeList.prototype.text = HTMLCollection.prototype.text;
NodeList.prototype.addClick = HTMLCollection.prototype.addClick;
NodeList.prototype.setClick = HTMLCollection.prototype.setClick;
NodeList.prototype.hide = HTMLCollection.prototype.hide;
NodeList.prototype.show = HTMLCollection.prototype.show;
NodeList.prototype.toggle = HTMLCollection.prototype.toggle;
NodeList.prototype.mask = HTMLCollection.prototype.mask;

// Extends HTMLElement prototype
HTMLElement.prototype.show = function() { fnShow(this); return this; }
HTMLElement.prototype.hide = function() { fnHide(this); return this; }
HTMLElement.prototype.toggle = function(name, force) { this.classList.toggle(name || HIDE_CLASS, force); return this; }
//HTMLElement.prototype.trigger = function(name, detail) { this.dispatchEvent(detail ? new CustomEvent(name, { detail }) : new Event(name)); } //ev.detail
HTMLElement.prototype.addClick = function(fn) { this.addEventListener("click", ev => fn(ev, this)); return this; }
HTMLElement.prototype.setClick = function(fn) { this.onclick = ev => fn(ev, this); return this; }
HTMLElement.prototype.setVisible = function(force) { return force ? this.show() : this.hide(); }
HTMLElement.prototype.isHidden = function() { return this.classList.contains(HIDE_CLASS); } // has class hide
HTMLElement.prototype.isVisible = function(selector) { return fnVisible(this) && (selector ? this.matches(selector) : true); }
HTMLElement.prototype.refresh = function(data, opts) {
		const value = this.dataset.refresh;
		if (value == "text-render") // render contents
			return this.render(data);
		if (value == "clear") // clear contents
			return this.setText(""); // set contents to empty
		const fnRefresh = data[value] || opts[value]; // handler
		if (!fnRefresh) // no handler linked to element
			fnHide(this); // element not renderizable yet!
		else if (value.startsWith("update"))
			fnRefresh(this); // actualizo el elemento
		else if (this.dataset.toggle) // toggle specific style class
			this.classList.toggle(this.dataset.toggle, fnRefresh(this));
		else // show / hide
			this.setVisible(fnRefresh(this));
		return this; // current HTMLElement instance
}

// Update attribute and style
HTMLElement.prototype.setDisabled = function(force) { return this.toggle("disabled", this.toggleAttribute("disabled", force)); }
HTMLElement.prototype.setReadonly = function(force) { // Update attribute readonly / disabled and style
	// The attribute readonly is not supported or relevant to <select> or input types file, checkbox, radio, range...
	const disabled = [ "file", "checkbox", "radio", "range", "color", "button" ].includes(this.type); // force disabled attribute
	return disabled ? this.setDisabled(force) : this.toggle("readonly", this.toggleAttribute("readonly", force));
}

HTMLElement.prototype.eachPrev = function(fn) {
    var el = this.previousElementSibling;
    for (let i = 0; el; el = el.previousElementSibling)
        fn(el, i++);
    return this;
}
HTMLElement.prototype.prev = function(selector) {
    var el = this.previousElementSibling;
    while (el) {
        if (el.matches(selector))
            return el;
        el = el.previousElementSibling;
    }
    return null;
}
HTMLElement.prototype.eachNext = function(fn) {
    var el = this.nextElementSibling;
    for (let i = 0; el; el = el.nextElementSibling)
        fn(el, i++);
    return this;
}
HTMLElement.prototype.next = function(selector) {
    var el = this.nextElementSibling;
    while (el) {
        if (el.matches(selector))
            return el;
        el = el.nextElementSibling;
    }
    return null;
}
HTMLElement.prototype.eachSibling = function(fn) { return this.eachPrev(fn).eachNext(fn); }
HTMLElement.prototype.sibling = function(selector) { return this.prev(selector) || this.next(selector); }

// Commons initializations in the HTML client
window.$1 = selector => document.querySelector(selector);
window.$$ = selector => document.querySelectorAll(selector);
HTMLElement.prototype.$1 = HTMLElement.prototype.querySelector;
HTMLElement.prototype.$$ = HTMLElement.prototype.querySelectorAll;

coll.dom = dom; // add reference
coll.ready = dom.ready; // shortcut
coll.getDivNull = () => divNull; // readonly element
coll.ready(i18n.setLanguage); // Load client language

export default coll;
