
import Multilang from "./langs/multilang.js";
import EnLang from "./langs/en/lang.js";
import EsLang from "./langs/es/lang.js";

// init. instance with default langs
const langs = new Multilang({ en: new EnLang(), es: new EsLang() });

// Extends HTMLElement prototype
const OPTS = { size: 1, index: 0 }; // default options
HTMLElement.prototype.setText = function(text) { this.innerHTML = text; return this; }
HTMLElement.prototype.setMsg = function(msg) { return this.setText(langs.msg(msg)); }
HTMLElement.prototype.render = function(data, opts) {
	opts = opts || OPTS; // default options
	this.dataset.template = this.dataset.template || this.innerHTML; // save current template
	this.innerHTML = langs.render(this.dataset.template, data, opts); // display new data
	return this.setVisible(opts.matches); // hide if empty
}
HTMLCollection.prototype.render = function(data) {
	OPTS.size = this.length; // array length
	this.forEach((el, i) => { OPTS.index = i; el.render(data, OPTS); });
	OPTS.size = OPTS.index = 0; // reset options
}
NodeList.prototype.render = HTMLCollection.prototype.render;

export default langs;
