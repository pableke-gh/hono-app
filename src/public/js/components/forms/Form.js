
import api from "../Api.js";
import tabs from "../Tabs.js";
import alerts from "../Alerts.js";

import Table from "../Table.js";
import input from "./InputBox.js";
import sbx from "./SelectBox.js";
import Datalist from "./Datalist.js";
import Autocomplete from "./Autocomplete.js";
import MultiSelectCheckbox from "./MultiSelectCheckbox.js";
import lang from "../../i18n/langs.js";

FormData.prototype.setJSON = function(name, data) {
	this.set(name, JSON.stringify(data)); // FormData only supports flat values
}
FormData.prototype.exclude = function(keys) {
	keys.forEach(key => this.delete(key)); // delete selected keys
}
FormData.prototype.load = function(data, keys) {
	keys.forEach(key => { // set slected keys
		const value = data[key];
		value && this.set(key, value);
	});
}

export default class Form {
	#form; #opts; // form element + options

	constructor(form, opts) { // Find form element or create empty form
		this.#form = globalThis.isstr(form) ? document.forms.findBy(form) : form;
		this.#form = this.#form || document.createElement("form");

		this.#opts = opts || {}; // default options
		this.#opts.defaultMsgOk = this.#opts.defaultMsgOk || "saveOk"; // default key for message ok
		this.#opts.defaultMsgError = this.#opts.defaultMsgError || "errForm"; // default key error
		this.#opts.inputErrorClass = this.#opts.inputErrorClass || "ui-error"; // Input error styles
		this.#opts.tipErrorClass = this.#opts.tipErrorClass || "ui-errtip"; // Tip error style
		this.#opts.refreshSelector = this.#opts.refreshSelector || ".form-refresh"; // selector for refresh

		// Form initialization
		input.setOptions(opts);
		this.#form.setAttribute("novalidate", "1");
		this.init().afterChange(() => { this.#opts.isChanged = true; })
					.beforeReset(ev => this.closeAlerts().autofocus());
	}

	init() { // Form initialization
		this.#form.elements.forEach(input.init);
		return this.autofocus();
	}

	querySelector = selector => this.#form.$1(selector); // Form child element
	querySelectorAll = selector => this.#form.$$(selector); // Form children elements
	getInput = selector => this.#form.elements.findBy(selector); // find an element
	getInputs = selector => this.#form.elements.filterBy(selector); // filter elements

	// Actions to update form view (inputs, texts, ...)
	#fnQuery = el => globalThis.isstr(el) ? this.#form.$1(el) : el;
	#fnQueryInput = el => globalThis.isstr(el) ? this.getInput(el) : el;
	#fnAction = (el, fn) => { el = this.#fnQueryInput(el); el && fn(el); return this; }
	#fnFor = (list, fn) => { list.forEach(fn); return this; }
	#fnEach = (selector, fn) => this.#fnFor(this.#form.$$(selector), fn);
	#fnUpdate = (selector, fn) => {
		selector = selector || "input,select,textarea"; // default all input fields
		return this.#fnFor(this.#form.elements, el => el.matches(selector) && fn(el));
	}

	getForm = () => this.#form;
	getNextElement = () => this.#form.nextElementSibling;
	getNext = selector => this.#form.next(selector);
	getElements = () => this.#form.elements;
	getElement = name => this.#form.elements.find(el => (el.name == name));
	getValueByName = name => input.val(this.getElement(name));
	addClass = name => { this.#form.classList.add(name); return this; }
	getOptions = () => this.#opts;
	setOptions = opts => {
		Object.assign(this.#opts, opts);
		input.setOptions(opts);
		return this;
	}

	get = name => this.#opts[name];
	set = (name, fn) => { this.#opts[name] = fn; return this; }
	isCached = id => (id == this.#opts.cache);
	setCache = id => { this.#opts.cache = id; return this; }
	resetCache = () => { delete this.#opts.cache; return this; } 
	isChanged = () => this.#opts.isChanged;
	setChanged = val => { this.#opts.isChanged = val; return this; }

	// Alerts helpers
	loading = () => { alerts.loading(); return this; } // Encapsule loading frame
	working = () => { alerts.working(); return this; } // Encapsule working frame
	showOk = msg => { alerts.showOk(msg); return this; } // Encapsule showOk message
	setOk = () => this.showOk(this.#opts.defaultMsgOk); // Force ok message
	showInfo = msg => { alerts.showInfo(msg); return this; } // Encapsule showInfo message
	showWarn = msg => { alerts.showWarn(msg); return this; } // Encapsule showWarn message
	showError = msg => { alerts.showError(msg); return this; } // Encapsule showError message
	showAlerts = alerts.showAlerts; // showAlerts synonym

	focus = el => { input.focus(el); return this; }
	setFocus = selector => this.#fnAction(selector, el => el.focus());
	autofocus = () => this.focus(this.#form.elements.find(el => el.isVisible("[tabindex]:not([type=hidden],[readonly],[disabled])")));
	copyToClipboard = str => navigator.clipboard.writeText(str)
									.then(() => console.log("Text copied to clipboard!"))
									.catch(err => console.error("Error copying text to clipboard:", err));

	getHtml = selector => this.#fnQuery(selector).innerHTML;
	setHtml = (selector, text) => { this.#fnQuery(selector).innerHTML = text; return this; }
	html = (selector, text) => { this.#form.$$(selector).html(text); return this; } // Update all texts info in form
	getText = selector => this.#fnQuery(selector).innerText;
	setText = (selector, text) => { this.#fnQuery(selector).innerText = text; return this; }
	text = (selector, text) => { this.#form.$$(selector).text(text); return this; } // Update all texts info in form
	render = (selector, data) => { this.#form.$$(selector).render(data); return this; } // NodeList.prototype.render
	refresh(model, selector) { this.#form.$$(selector || this.#opts.refreshSelector).refresh(model, this.#opts); return this; } // NodeList.prototype.refresh
	send = url => api.setForm(this.#form).send(url || this.#form.action).catch(info => { this.setErrors(info); throw info; });
	nextTab = tab => { // change tab inside form
		if (tab && tabs.isActive(tab)) // same tab
			return this.setOk(); // show ok msg
		tabs.nextTab(tab); // go to next tab
		return this;
	}

	hide = selector => { this.#form.$$(selector).hide(); return this; }
	show = selector => { this.#form.$$(selector).show(); return this; }
	setVisible = (selector, force) => force ? this.show(selector) : this.hide(selector);
	disabled = (force, selector) => this.#fnUpdate(selector, el => el.setDisabled(force));
	readonly = (force, selector) => this.#fnUpdate(selector, el => el.setReadonly(force));
	eachInput = (selector, fn) => this.#fnUpdate(selector, fn);
	setEditable = (model, selector) => this.#fnUpdate(selector, el => {
		const value = el.dataset.disabled || el.dataset.readonly || el.dataset.editable;
		if (value == "manual")
			return; // skip evaluation (input manual)
		if (el.dataset.disabled) {
			const fnDisabled = model[value] || this.#opts[value] || model.isDisabled;
			return el.setDisabled(fnDisabled()); // recalc. disabled attribute by handler
		}
		if (el.dataset.readonly) {
			const fnReadonly = model[value] || this.#opts[value] || model.isReadonly;
			return el.setReadonly(fnReadonly()); // recalc. readonly attribute by handler
		}
		const fnEditable = model[value] || this.#opts[value] || model.isEditable;
		el.setReadonly(!fnEditable()); // recalc. attribute by handler
	});
	reactivate = (model, tab) => { // set inputs values and readonly
		this.closeAlerts().setEditable(model).refresh(model);
		tabs.viewTab(tab ?? "form"); // show tab and preserve messages
		return this;
	}

	// Value property
	getValue = input.getValue;
	getval = selector => this.#fnQueryInput(selector)?.value;
	valueOf = selector => this.getValue(this.#fnQueryInput(selector));
	getData = selector => {
		const data = {}; // Results container
		this.#fnUpdate(selector, el => input.load(el, data));
		return data;
	}

	#resetValue(selector) { return this.#fnUpdate(selector, input.reset); }
	setval = (selector, value) => this.#fnAction(selector, el => input.setval(el, value));
	setValue = (selector, value) => this.#fnAction(selector, el => input.setValue(el, value));
	copy = (el1, el2) => { input.setval(this.#fnQueryInput(el1), this.getval(el2)); return this; } // copy value from el2 to el1
	restart = selector => this.#fnAction(selector, el => { input.reset(el); el.focus(); }); // remove value + focus
	reset(selector) { return this.#resetValue(selector); } // clear selected inputs values
	setData(data, selector) {
		const fnSetValue = el => input.setValue(el, data[el.name]);
		if (data && selector) // update a subgroup of inputs
			this.#fnUpdate(selector, fnSetValue);
		else if (data) // update all inputs
			this.#form.elements.forEach(el => (el.name && fnSetValue(el)));
		else
			this.#resetValue(selector); // clear selected inputs values
		return this.setChanged(); // force changed = false 
	}
	setValues = (data, selector) => this.#fnUpdate(selector, el => {
		const value = el.name ? data[el.name] : null; // get value by name
		globalThis.isset(value) && input.setValue(el, value); // update defined data
	});
	setDateRange = (f1Selector, f2Selector, fnBlur) => {
		const el1 = this.#fnQueryInput(f1Selector);
		const el2 = this.#fnQueryInput(f2Selector);
		if (el1 && el2) // check if fields exist
			input.setDateRange(el1, el2, fnBlur);
		return this;
	}

	getAttr = (selector, name) => input.getAttr(this.#fnQueryInput(selector), name);
	delAttr = (selector, name) => { input.delAttr(this.#fnQueryInput(selector), name); return this; }
	setAttr = (selector, name, value) => { input.setAttr(this.#fnQueryInput(selector), name, value); return this; }
	setAttribute = this.setAttr;

	getUrlParams = () => new URLSearchParams(new FormData(this.#form));
	getFormData = (data, include) => {
		const fd = new FormData(this.#form);
		data && fd.load(data, include);
		return fd; // merge data to send
	}

	// Inputs helpers
	setTable = (selector, opts) => new Table(this.#form.$1(selector), opts); // table
	stringify = (selector, data, replacer) => this.setval(selector, JSON.stringify(data, replacer)).setChanged(true);
	saveTable = (selector, table, replacer) => this.stringify(selector, table.getData(), replacer);
	getOptionText = selector => sbx.getOptionText(this.#fnQueryInput(selector));
	getOptionTextByValue = (selector, value) => sbx.getOptionTextByValue(this.#fnQueryInput(selector), value);
	select = (selector, mask) => { sbx.select(this.#fnQueryInput(selector), mask); return this; }
	setDatalist = (selector, opts) => new Datalist(this.#fnQueryInput(selector), opts); // select / optgroup
	setItems = (selector, items, emptyOption) => this.#fnUpdate(selector, el => sbx.setItems(el, items, emptyOption));
	setDataOptions = (selector, data, emptyOption) => this.#fnUpdate(selector, el => sbx.setData(el, data, emptyOption));
	setLabels = (selector, labels, emptyOption) => this.#fnUpdate(selector, el => sbx.setLabels(el, labels, emptyOption));
	setMultiSelectCheckbox = (selector, opts) => new MultiSelectCheckbox(this.#form.$1(selector), opts); // multi select checkbox
	setAutocomplete = (selector, opts) => new Autocomplete(this.#fnQueryInput(selector), opts); // Input type text / search

	showModal = selector => this.#form.$1(selector).showModal();
	closeModal = () => this.#form.$1("dialog[open]").close();

	// Events handlers
	#fnEvent = (el, name, fn) => { el.addEventListener(name, ev => fn(ev, el)); return this; }
	#fnChange = (el, fn) => this.#fnEvent(el, "change", fn);

	afterChange = fn => this.#fnChange(this.#form, fn); // add change event handler
	onKeydown = fn => this.#fnEvent(this.#form, "keydown", fn); // add event handler
	onSubmit = fn => this.#fnEvent(this.#form, "submit", fn); // add event handler
	fire = action => (this.get(action)()); // fire manual handler
	fireSubmit = () => { this.#form.submit(); return this; } // force submit
	fireReset = () => { this.#form.reset(); return this; }
	beforeReset = fn => this.#fnEvent(this.#form, "reset", fn);
	afterReset = fn => this.#fnEvent(this.#form, "reset", ev => setTimeout(() => fn(ev), 1));

	addClickAll = (selector, fn) => this.#fnEach(selector, el => el.addClick(fn));
	addClick = (selector, fn) => { this.#fnQuery(selector)?.addClick(fn); return this; }
	setClickAll = (selector, fn) => this.#fnEach(selector, el => el.setClick(fn));
	setClick = (selector, fn) => { this.#fnQuery(selector)?.setClick(fn); return this; }
	click = selector => { this.#form.$1(selector).click(); return this; } // Fire event only for PF

	onChange = (selector, fn) => this.#fnAction(selector, el => this.#fnChange(el, fn));
	onChangeInputs = (selector, fn) => this.#fnUpdate(selector, el => this.#fnChange(el, fn));
	setChangeInput = (selector, fn) => this.#fnAction(selector, el => { el.onchange = fn; });
	onChangeInput = this.onChange; // synonym

	onChangeFile = (selector, fn) => this.#fnAction(selector, el => input.file(el, fn));
	onChangeFiles = (selector, fn) => this.#fnUpdate(selector, el => input.file(el, fn));
	setField = (selector, value, fn) => this.#fnAction(selector, el => { this.#fnChange(el, fn); input.setValue(el, value); }); 

	// Form Validator
	closeAlerts = () => {
		alerts.closeAlerts(); // globbal message
		this.#form.elements.forEach(el => el.classList.remove(this.#opts.inputErrorClass));
		this.#form.getElementsByClassName(this.#opts.tipErrorClass).text("");
		return this;
	}
	setErrors = messages => {
		if (globalThis.isstr(messages)) // simple message text
			return this.showError(messages); // show error message
		const valid = lang.getValidation(); // get form validators
		// Style error inputs and set focus on first error
		messages = messages || valid.getMsgs(); // default messages
		this.#form.elements.eachPrev(el => input.setError(el, messages[el.name]));
		this.showError(messages.msgError || this.#opts.defaultMsgError);
		valid.reset(); // reset for next validation
		return this;
	}
	validate = (fnValidator, selector) => {
		const data = this.closeAlerts().getData(selector); // current form data
		return fnValidator(data) ? data : !this.setErrors(); // model preserve this
	}
}
