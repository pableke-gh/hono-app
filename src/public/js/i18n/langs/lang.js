
import nb from "../../components/types/NumberBox.js";
import Validators from "../Validators.js";

const RE_VAR = /[@$](\w+)(\.\w+)?;/g;
const OPTS = { size: 1, index: 0 }; // default options

export default class Base {
	static #lang; // default language instance
	static getLang = () => Base.#lang; // current language instance
	static setLang(lang) { Base.#lang = lang; return Base.#lang; } // set current language

	get(key) { return Base.#lang.get(key); }
	set(name, msg) { return Base.#lang.set(name, msg); }
	getItem = (key, index) => this.get(key)[index];
	confirm = msg => (msg ? confirm(this.get(msg)) : true);
	boolval = str => (globalThis.isset(str) ? this.getItem("msgBool", +["1", "true", "yes", "on"].includes("" + str)) : null);

	isDefault = () => Base.#lang.isDefault();
	getIsoLang = () => Base.#lang.getIsoLang();

	// Date formats
	enDate = str => str && str.substring(0, 10); //yyyy-mm-dd
	isoDate = str => Base.#lang.isoDate(str);
	strDate = date => Base.#lang.strDate(date);
	isoTime = str => str && str.substring(11, 19); //hh:MM:ss
	isoTimeShort = str => str && str.substring(11, 16); //hh:MM
	isoDateTime = str => this.isoDate(str) + " " + this.isoTime(str); //ISO date + hh:MM:ss

	// Float formats
	toFloat = str => Base.#lang.toFloat(str);
	floatval = str => Base.#lang.floatval(str);

	// Float to String formated
	isoFloat = num => Base.#lang.isoFloat(num);
	isoFloat1 = num => Base.#lang.isoFloat1(num);
	isoFloat2 = num => Base.#lang.isoFloat2(num);
	isoFloat3 = num => Base.#lang.isoFloat3(num);

	// String to String formated (reformated)
	fmtFloat = str => Base.#lang.fmtFloat(str);
	fmtFloat1 = str => Base.#lang.fmtFloat1(str);
	fmtFloat2 = str => Base.#lang.fmtFloat2(str);
	fmtFloat3 = str => Base.#lang.fmtFloat3(str);

	// Int formats
	toInt = nb.toInt; // String to Int instance
	intval = nb.intval; // String to navite integer
	isoInt = num => Base.#lang.isoInt(num); // Int to String formated
	fmtInt = str => Base.#lang.fmtInt(str); // String to String formated (reformated)

	#valid = new Validators(); //validators instance
	getValidation = () => this.#valid; // Current validators
	getValidators = () => this.#valid.reset(); // Init. messages
	setValidators(valid) { this.#valid = valid; return this; }

	// Render styled string
	render = (str, data, opts) => {
		opts = opts || OPTS;
		opts.size = opts.size || 1;
		opts.index = opts.index || 0;
		opts.count = opts.index + 1;
		opts.matches = opts.keys = 0;
		data = data || Base.getLang(); // default data = lang
		const fnValue = data.getValue || (k => (data[k]));
		return str.replace(RE_VAR, (m, k, t) => { // replacer
			opts.keys++; // always increment keys matches
			const value = fnValue(k) ?? this.get(k); // value to replace
			opts.matches += globalThis.isset(value); // increment matches
			if (m.startsWith("$")) // float / currency
				return this.isoFloat(value);
			if (t == ".d") // Object Date or Date in ISO string format
				return dt.isValid(value) ? this.strDate(value) : this.isoDate(value); // substring = 0, 10
			//if (globalThis.isFunc(value)) // function type
				//return value(opts); // call function
			return (value ?? opts[k] ?? ""); // Default = String
		});
	}
}

// Extends HTMLElement prototype
HTMLElement.prototype.setText = function(text) { this.innerHTML = text; return this; }
HTMLElement.prototype.setMsg = function(msg) { return this.setText(Base.getLang().get(msg)); }
HTMLElement.prototype.render = function(data, opts) {
	opts = opts || OPTS; // default options
	this.dataset.template = this.dataset.template || this.innerHTML; // save current template
	this.innerHTML = Base.getLang().render(this.dataset.template, data, opts); // display new data
	return this.setVisible(opts.matches); // hide if empty
}
HTMLCollection.prototype.render = function(data) {
	OPTS.size = this.length; // array length
	this.forEach((el, i) => { OPTS.index = i; el.render(data, OPTS); });
	OPTS.size = OPTS.index = 0; // reset options
}
NodeList.prototype.render = HTMLCollection.prototype.render;
