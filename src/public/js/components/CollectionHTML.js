
import dom from "./forms/DomBox.js";
import coll from "./Collection.js";
import i18n from "../i18n/langs.js";

const OPTS = {};
const HIDE_CLASS = "hide";
const fnHide = el => el.classList.add(HIDE_CLASS);
const fnShow = el => el.classList.remove(HIDE_CLASS);
const fnVisible = el => (el.offsetWidth || el.offsetHeight || el.getClientRects().length);
const fnRender = (el, data, opts) => {
    el.dataset.template = el.dataset.template || el.innerHTML; // save current template
    el.innerHTML = i18n.render(el.dataset.template, data, opts); // display new data
	el.classList.toggle(HIDE_CLASS, !opts.matches); // hide if empty
	return el; // current HTMLElement instance
}
const fnRefresh = (el, data, opts) => {
	if (el.dataset.refresh == "text-render")
		return fnRender(el, data, OPTS); // render contents only
	const fnRefresh = opts[el.dataset.refresh]; // handler
	if (el.dataset.toggle) // toggle specific style class
		el.classList.toggle(el.dataset.toggle, fnRefresh(el));
	else // show / hide
		el.setVisible(fnRefresh(el));
	return el; // current HTMLElement instance
}

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
HTMLCollection.prototype.refresh = function(data, opts) { this.forEach(el => fnRefresh(el, data, opts)); }
HTMLCollection.prototype.render = function(data) {
	OPTS.size = this.length; // array length
	this.forEach((el, i) => { OPTS.index = i; fnRender(el, data, OPTS); });
}
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
NodeList.prototype.render = HTMLCollection.prototype.render;
NodeList.prototype.html = HTMLCollection.prototype.html;
NodeList.prototype.text = HTMLCollection.prototype.text;
NodeList.prototype.addClick = HTMLCollection.prototype.addClick;
NodeList.prototype.setClick = HTMLCollection.prototype.setClick;
NodeList.prototype.hide = HTMLCollection.prototype.hide;
NodeList.prototype.show = HTMLCollection.prototype.show;
NodeList.prototype.toggle = HTMLCollection.prototype.toggle;
NodeList.prototype.mask = HTMLCollection.prototype.mask;

// Extends HTMLElement prototype
HTMLElement.prototype.setMsg = function(msg) { this.innerHTML = i18n.get(msg); return this }
HTMLElement.prototype.show = function() { fnShow(this); return this }
HTMLElement.prototype.hide = function() { fnHide(this); return this }
HTMLElement.prototype.toggle = function(name, force) { this.classList.toggle(name || HIDE_CLASS, force); return this; }
//HTMLElement.prototype.trigger = function(name, detail) { this.dispatchEvent(detail ? new CustomEvent(name, { detail }) : new Event(name)); } //ev.detail
HTMLElement.prototype.addClick = function(fn) { this.addEventListener("click", ev => fn(ev, this)); return this; }
HTMLElement.prototype.setClick = function(fn) { this.onclick = ev => fn(ev, this); return this; }
HTMLElement.prototype.setVisible = function(force) { return force ? this.show() : this.hide(); }
HTMLElement.prototype.isHidden = function() { return this.classList.contains(HIDE_CLASS); } // has class hide
HTMLElement.prototype.isVisible = function(selector) { return fnVisible(this) && (selector ? this.matches(selector) : true); }
HTMLElement.prototype.render = function(data, opts) { return fnRender(this, data, opts || OPTS); }
HTMLElement.prototype.refresh = function(data, opts) { return fnRefresh(this, data, opts); }

HTMLElement.prototype.setDisabled = function(force) { // Update attribute and style
    this.classList.toggle("disabled", this.toggleAttribute("disabled", force));
    return this;
}
HTMLElement.prototype.setReadonly = function(force) { // Update attribute and style
    // The attribute readonly is not supported or relevant to <select> or input types file, checkbox, radio, range...
    if ([ "file", "checkbox", "radio", "range", "color", "button" ].includes(this.type))
        return this.setDisabled(force); // Force disabled attribute
    this.classList.toggle("readonly", this.toggleAttribute("readonly", force));
    return this;
}

// Commons initializations in the HTML client
window.$1 = selector => document.querySelector(selector);
window.$$ = selector => document.querySelectorAll(selector);

coll.dom = dom; // add reference
coll.ready = dom.ready; // shortcut
coll.getDivNull = dom.getDivNull; // readonly element
coll.ready(i18n.setLanguage); // Load client language

export default coll;
