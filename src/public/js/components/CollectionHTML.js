
import dom from "./forms/DomBox.js";
import coll from "./Collection.js";
import i18n from "../i18n/langs.js";

const HIDE_CLASS = "hide";
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
HTMLCollection.prototype.query = function(selector) { return this.filter(el => el.matches(selector)); }
HTMLCollection.prototype.render = function(data) { this.forEach((el, i) => el.render(data, i, this.length)); return this; }
HTMLCollection.prototype.html = function(text) { this.forEach(el => { el.innerHTML = text; }); return this; }
HTMLCollection.prototype.text = function(text) { this.forEach(el => { el.innerText = text; }); return this; }
HTMLCollection.prototype.addClick = function(fn) { this.forEach(el => el.addClick(fn)); };
HTMLCollection.prototype.setClick = function(fn) { this.forEach(el => el.setClick(fn)); };
HTMLCollection.prototype.hide = function() { this.forEach(fnHide); return this; }
HTMLCollection.prototype.show = function() { this.forEach(fnShow); return this; }
HTMLCollection.prototype.toggle = function(name, force) {
    name = name || HIDE_CLASS; // Toggle class name
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
NodeList.prototype.query = HTMLCollection.prototype.query;
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
HTMLElement.prototype.isVisible = function(selector) {
    return fnVisible(this) && (selector ? this.matches(selector) : true);
}
HTMLElement.prototype.render = function(data, i, size) {
    this.dataset.template = this.dataset.template || this.innerHTML; // save current template
    this.innerHTML = i18n.render(this.dataset.template, data, i, size); // display new data
    return this;
}

HTMLElement.prototype.setDisabled = function(force) { // Update attribute and style
    this.classList.toggle("disabled", this.toggleAttribute("disabled", force));
    return this;
}
HTMLElement.prototype.setReadonly = function(force) { // Update attribute and style
    // The attribute readonly is not supported or relevant to <select> or input types file, checkbox, radio, range...
    if ([ "file", "checkbox", "radio", "range" ].includes(this.type))
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
