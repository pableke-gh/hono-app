
import api from "../Api.js";
import tabs from "../Tabs.js";
import alerts from "../Alerts.js";

import Table from "../Table.js";
import FormDataBox from "./FormData.js";
import TextInput from "../inputs/TextInput.js";
import DataList from "../inputs/DataList.js";
import BoolInput from "../inputs/BoolInput.js";
import FloatInput from "../inputs/FloatInput.js";
import DateInput from "../inputs/DateInput.js";
import TimeInput from "../inputs/TimeInput.js";
import TextArea from "../inputs/TextArea.js";
import FileInput from "../inputs/FileInput.js";
import ButtonForm from "../inputs/ButtonForm.js";
import Autocomplete from "../inputs/Autocomplete.js";
import MultiSelectCheckbox from "../inputs/MultiSelectCheckbox.js";

export default class Form /*extends HTMLFormElement*/ {
	#form; #opts; // form element + options

	constructor(form, opts) { // Find form element or create empty form
		this.#form = globalThis.isstr(form) ? document.forms.findBy(form) : form;
		this.#form = this.#form || document.createElement("form");

		this.#opts = opts || {}; // default options
		this.#opts.defaultMsgOk = this.#opts.defaultMsgOk || "saveOk"; // default key for message ok
		this.#opts.defaultMsgError = this.#opts.defaultMsgError || "errForm"; // default key error
		this.#opts.refreshSelector = this.#opts.refreshSelector || ".form-refresh"; // selector for refresh

		// Form initialization
		this.#form.setAttribute("novalidate", "1");
	}

	init() {
		return this.afterChange(() => this.setChanged(true)).beforeReset(ev => this.closeAlerts().autofocus());
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
	#fnUpdate = (selector, fn) => {
		selector = selector || "input,select,textarea"; // default all input fields
		return this.#fnFor(this.#form.elements, el => el.matches(selector) && fn(el));
	}

	getForm = () => this.#form;
	getNextElement = () => this.#form.nextElementSibling;
	getNext = selector => this.#form.next(selector);
	getElements = () => this.#form.elements;
	getElement = name => this.#form.elements[name];
	getValueByName = name => this.getElement(name).value;
	addClass = name => { this.#form.classList.add(name); return this; }
	getOptions = () => this.#opts;

	get = name => this.#opts[name];
	set = (name, fn) => { this.#opts[name] = fn; return this; }
	isChanged = () => this.#opts.isChanged;
	setChanged(val) { this.#opts.isChanged = val; return this; }
	isCached = id => (id == this.#opts.cache);
	setCache(id) { this.#opts.cache = id; return this.setChanged(); } // new cache => NO changes
	resetCache() { delete this.#opts.cache; return this.setChanged(); } // reset cache => NO changes

	// Alerts helpers
	loading = () => { alerts.loading(); return this; } // Encapsule loading frame
	working = () => { alerts.working(); return this; } // Encapsule working frame
	showOk = msg => { alerts.showOk(msg); return this; } // Encapsule showOk message
	setOk = () => this.showOk(this.#opts.defaultMsgOk); // Force ok message
	showInfo = msg => { alerts.showInfo(msg); return this; } // Encapsule showInfo message
	showWarn = msg => { alerts.showWarn(msg); return this; } // Encapsule showWarn message
	showError = msg => { alerts.showError(msg); return this; } // Encapsule showError message
	showAlerts = alerts.showAlerts; // showAlerts synonym

	focus = el => { el.focus(); return this; }
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
	refresh(model, selector) { this.#form.$$(selector || this.#opts.refreshSelector).refresh(model, this.#opts); tabs.setHeight(); return this; } // NodeList.prototype.refresh
	send = url => api.setForm(this.#form).send(url || this.#form.action).catch(info => { this.setErrors(info); throw info; });
	nextTab = tab => { // change tab inside form
		if (tab && tabs.isActive(tab)) // same tab
			return this.setOk(); // show ok msg
		tabs.nextTab(tab); // go to next tab
		return this;
	}

	eachInput = (selector, fn) => this.#fnUpdate(selector, fn);
	hide = selector => { this.#form.$$(selector).hide(); tabs.setHeight(); return this; }
	show = selector => { this.#form.$$(selector).show(); tabs.setHeight(); return this; }
	setVisible = (selector, force) => force ? this.show(selector) : this.hide(selector);
	disabled = (force, selector) => this.#fnUpdate(selector, el => el.setDisabled(force));
	readonly = (force, selector) => this.#fnUpdate(selector, el => el.setReadonly(force));
	setEditable = (model, selector) => this.#fnUpdate(selector, el => {
		const value = el.dataset.disabled /*|| el.dataset.readonly*/ || el.dataset.editable;
		if (value == "manual") return; // skip evaluation (input manual)
		if (el.dataset.disabled) {
			const fnDisabled = model[value] || this.#opts[value] || model.isDisabled;
			return el.setDisabled(fnDisabled()); // recalc. disabled attribute by handler
		}
		/*if (el.dataset.readonly) {
			const fnReadonly = model[value] || this.#opts[value] || model.isReadonly;
			return el.setReadonly(fnReadonly()); // recalc. readonly attribute by handler
		}*/
		const fnEditable = model[value] || this.#opts[value] || model.isEditable;
		el.setEditable(fnEditable()); // recalc. attribute by handler
	});
	reactivate = (model, tab) => { // set inputs values and readonly
		this.closeAlerts().setEditable(model).refresh(model);
		tabs.viewTab(tab ?? "form"); // show tab and preserve messages
		return this;
	}

	// Value property
	getValue = name => this.getElement(name).getValue();
	getData = selector => {
		const data = {}; // Results container
		this.#fnUpdate(selector, el => el.load(data));
		return data;
	}

	setValue(name, value) { this.getElement(name).setValue(value); return this; }
	reset(selector) { return this.#fnUpdate(selector, el => el.reset()); } // clear selected inputs values
	restart(name) { this.getElement(name).restart(); return this; }; // remove value + focus
	setData(data, selector) {
		const fnSetValue = el => el.setValue(data[el.name]);
		if (data && selector) // update a subgroup of inputs
			this.#fnUpdate(selector, fnSetValue);
		else if (data) // update all inputs
			this.#form.elements.forEach(el => (el.name && fnSetValue(el)));
		else
			this.reset(selector); // clear selected inputs values
		return this;
	}
	setValues = (data, selector) => this.#fnUpdate(selector, el => {
		const value = el.name ? data[el.name] : null; // get value by name
		globalThis.isset(value) && el.setValue(value); // update defined data
	});

	getAttr = (selector, name) => this.#fnQueryInput(selector).getAttribute(name);
	delAttr = (selector, name) => { this.#fnQueryInput(selector).removeAttribute(name); return this; }
	setAttr = (selector, name, value) => { this.#fnQueryInput(selector).setAttribute(name, value); return this; }
	setAttribute = this.setAttr;

	getUrlParams = () => new URLSearchParams(new FormData(this.#form));
	getFormData(data, include) {
		const fd = new FormDataBox(this.#form);
		return fd.load(data, include); // merge data
	}
	getFormDataInputs(selector) {
		const fd = new FormDataBox(); // partial form
		return fd.setInputs(this.getInputs(selector));
	}

	// Inputs helpers
	setTable = (selector, opts) => new Table(this.#form.$1(selector), opts); // table
	stringify = (name, data, replacer) => this.setValue(name, JSON.stringify(data, replacer));
	getOptionText = name => this.getElement(name).getText(); // data-list required
	select(name, mask) { this.getElement(name).select(mask); return this; }
	setItems = (selector, items) => this.#fnUpdate(selector, el => el.setItems(items));
	setLabels = (selector, labels) => this.#fnUpdate(selector, el => el.setLabels(labels));
	setMultiSelectCheckbox = (selector, opts) => new MultiSelectCheckbox(this.#form.$1(selector), opts); // multi select checkbox
	setAutocomplete = (selector, opts) => new Autocomplete(this.#fnQueryInput(selector), opts); // Input type text / search

	showModal = selector => this.#form.$1(selector).showModal();
	closeModal = () => this.#form.$1("dialog[open]").close();

	// Events handlers
	#fnEvent = (el, name, fn) => { el.addEventListener(name, ev => fn(ev, el)); return this; }
	#fnChange = (el, fn) => this.#fnEvent(el, "change", fn);

	afterChange = fn => this.#fnChange(this.#form, fn); // add change event handler
	onSubmit = fn => this.#fnEvent(this.#form, "submit", fn); // add event handler
	fireReset = () => { this.#form.reset(); return this; }
	beforeReset = fn => this.#fnEvent(this.#form, "reset", fn);
	afterReset = fn => this.#fnEvent(this.#form, "reset", ev => setTimeout(() => fn(ev), 1));

	onChange = (selector, fn) => this.#fnUpdate(selector, el => el.addChange(fn));
	addChange(name, fn) { this.getElement(name).addChange(fn); return this; }
	setClick = (selector, fn) => { this.#fnQuery(selector)?.setClick(fn); return this; }
	click = selector => { this.#form.$1(selector).click(); return this; } // Fire event only for PF

	// Form Validator
	closeAlerts() {
		alerts.closeAlerts(); // globbal message
		this.#form.elements.forEach(el => el.setOk()); // clear input messages
		return this;
	}
	setErrors(messages) {
		messages.msgError = messages.msgError || this.#opts.defaultMsgError;
		this.#form.elements.eachPrev(el => el.update(messages[el.name]));
		alerts.setMsgs(messages); // show all messages
		return this;
	}
}

customElements.define("text-input", TextInput, { extends: "input" });
customElements.define("data-list", DataList, { extends: "select" });
customElements.define("float-input", FloatInput, { extends: "input" });
customElements.define("bool-input", BoolInput, { extends: "input" });
customElements.define("date-input", DateInput, { extends: "input" });
customElements.define("time-input", TimeInput, { extends: "input" });
customElements.define("text-area", TextArea, { extends: "textarea" });
customElements.define("file-input", FileInput, { extends: "input" });
customElements.define("btn-form", ButtonForm, { extends: "button" });
