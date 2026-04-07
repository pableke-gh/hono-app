
import api from "../Api.js";
import tabs from "../Tabs.js";
import alerts from "../Alerts.js";

import Table from "../Table.js";
import FormDataBox from "./FormData.js";
import input from "../inputs/FormInput.js";
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

export default class FormHTML extends HTMLFormElement {
	#opts = {
		defaultMsgOk: "saveOk", defaultMsgError: "errForm", // default key messages
		errorClass: "ui-error", tipErrorClass: "ui-errtip", negativeClass: "text-red", // default css class input
		refreshSelector: ".form-refresh" // element selector for refresh
	};

	constructor() {
		super(); // Must call super before 'this'
		// Form default initialization
		input.setOptions(this.#opts);
		this.setAttribute("novalidate", "1");
		this.afterChange(() => this.setChanged(true)).beforeReset(ev => this.closeAlerts().autofocus());
	}

	// Actions to update form view (inputs, texts, ...)
	#fnQuery = el => globalThis.isstr(el) ? this.$1(el) : el;
	#fnQueryInput = el => globalThis.isstr(el) ? this.getInput(el) : el;
	#fnAction = (el, fn) => { el = this.#fnQueryInput(el); el && fn(el); return this; }
	#fnUpdate = (selector, fn) => { // iterate over elements
		this.elements.forEach(selector ? (el => { el.matches(selector) && fn(el); }) : fn);
		return this;
	}

	getOptions = () => this.#opts;
	getElement = name => this.elements[name];
	getInput = selector => this.elements.findBy(selector); // find an element
	getInputs = selector => this.elements.filterBy(selector); // filter elements

	get = name => this.#opts[name];
	set = (name, fn) => { this.#opts[name] = fn; return this; }
	isChanged = () => this.#opts.isChanged;
	setChanged(val) { this.#opts.isChanged = val; return this; }
	isCached = id => (id == this.#opts.cache);
	setCache(id) { this.#opts.cache = id; return this.setChanged(); } // new cache => NO changes
	resetCache() { delete this.#opts.cache; return this.setChanged(); } // reset cache => NO changes

	// Alerts helpers
	showOk = msg => { alerts.showOk(msg); return this; } // Encapsule showOk message
	setOk = () => this.showOk(this.#opts.defaultMsgOk); // Force ok message
	showInfo = msg => { alerts.showInfo(msg); return this; } // Encapsule showInfo message
	showWarn = msg => { alerts.showWarn(msg); return this; } // Encapsule showWarn message
	showError = msg => { alerts.showError(msg); return this; } // Encapsule showError message

	focus = el => { el.focus(); return this; }
	setFocus = selector => this.#fnAction(selector, el => el.focus());
	autofocus = () => this.focus(this.elements.find(el => el.isVisible("[tabindex]:not([type=hidden],[readonly],[disabled])")));
	copyToClipboard = str => navigator.clipboard.writeText(str)
									.then(() => console.log("Text copied to clipboard!"))
									.catch(err => console.error("Error copying text to clipboard:", err));

	getHtml = selector => this.#fnQuery(selector).innerHTML;
	setHtml = (selector, text) => { this.#fnQuery(selector).innerHTML = text; return this; }
	html = (selector, text) => { this.$$(selector).html(text); return this; } // Update all texts info in form
	getText = selector => this.#fnQuery(selector).innerText;
	setText = (selector, text) => { this.#fnQuery(selector).innerText = text; return this; }
	text = (selector, text) => { this.$$(selector).text(text); return this; } // Update all texts info in form
	render = (selector, data) => { this.$$(selector).render(data); return this; } // NodeList.prototype.render
	refresh(model, selector) { this.$$(selector || this.#opts.refreshSelector).refresh(model, this.#opts); tabs.setHeight(); return this; } // NodeList.prototype.refresh
	send = url => api.setForm(this).send(url || this.action).catch(info => { this.setErrors(info); throw info; });
	nextTab = tab => { // change tab inside form
		if (tab && tabs.isActive(tab)) // same tab
			return this.setOk(); // show ok msg
		tabs.next(tab); // go to next tab
		return this;
	}

	eachInput = (selector, fn) => this.#fnUpdate(selector, fn);
	hide = selector => { this.$$(selector).hide(); tabs.setHeight(); return this; }
	show = selector => { this.$$(selector).show(); tabs.setHeight(); return this; }
	setVisible = (selector, force) => force ? this.show(selector) : this.hide(selector);
	disabled = (force, selector) => this.#fnUpdate(selector, el => el.setDisabled(force));
	readonly = (force, selector) => this.#fnUpdate(selector, el => el.setReadonly(force));
	setEditable = (model, selector) => this.#fnUpdate(selector, el => el.setEditable(model));
	prepare = (model, selector) => this.#fnUpdate(selector, el => el.prepare(model));
	reactivate = model => this.closeAlerts().setEditable(model).setCache(model.getId()).refresh(model);
	load = model => this.closeAlerts().prepare(model).setCache(model.getId()).refresh(model);

	// Value property
	getValue = name => this.getElement(name).getValue();
	getData = selector => {
		const data = {}; // Results container
		this.#fnUpdate(selector, el => el.toData(data));
		return data;
	}

	setValue(name, value) { this.getElement(name).setValue(value); return this; }
	reset(selector) { return this.#fnUpdate(selector, el => el.reset()); } // clear selected inputs values
	restart(name) { this.getElement(name).restart(); return this; }; // remove value + focus
	setData(data, selector) {
		const fnLoad = el => el.load(data);
		if (data && selector) // update a subgroup of inputs
			this.#fnUpdate(selector, fnLoad);
		else if (data) // update all inputs
			this.elements.forEach(el => (el.name && fnLoad(el)));
		else
			this.reset(selector); // clear selected inputs values
		return this;
	}

	getAttr = (selector, name) => this.getElement(selector).getAttribute(name);
	delAttr(selector, name) { this.getElement(selector).removeAttribute(name); return this; }
	setAttr(selector, name, value) { this.getElement(selector).setAttribute(name, value); return this; }

	getUrlParams = () => new URLSearchParams(new FormData(this));
	getFormData(selector) {
		const fd = new FormDataBox(); // partial form
		return fd.addInputs(selector ? this.getInputs(selector) : this.getElements());
	}

	// Inputs helpers
	setTable = (selector, opts) => new Table(this.$1(selector), opts); // table
	stringify = (name, data, replacer) => this.setValue(name, JSON.stringify(data, replacer));
	getOptionText = name => this.getElement(name).getText(); // data-list required
	select(name, mask) { this.getElement(name).select(mask); return this; }
	setItems = (selector, items) => this.#fnUpdate(selector, el => el.setItems(items));
	setLabels = (selector, labels) => this.#fnUpdate(selector, el => el.setLabels(labels));
	setMultiSelectCheckbox = (selector, opts) => new MultiSelectCheckbox(this.$1(selector), opts); // multi select checkbox
	setAutocomplete = (name, opts) => new Autocomplete(this.getElement(name), opts); // Input type text / search

	showModal = selector => this.$1(selector).showModal();
	closeModal = () => this.$1("dialog[open]").close();

	// Events handlers
	#fnEvent = (el, name, fn) => { el.addEventListener(name, ev => fn(ev, el)); return this; }
	afterChange = fn => this.#fnEvent(this, "change", fn); // add change event handler
	onSubmit = fn => this.#fnEvent(this, "submit", fn); // add event handler
	fireReset = () => { this.reset(); return this; }
	beforeReset = fn => this.#fnEvent(this, "reset", fn);
	afterReset = fn => this.#fnEvent(this, "reset", ev => setTimeout(() => fn(ev), 1));

	onChange = (selector, fn) => this.#fnUpdate(selector, el => el.addChange(fn));
	addChange(name, fn) { this.getElement(name).addChange(fn); return this; }
	setClick = (selector, fn) => { this.#fnQuery(selector)?.setClick(fn); return this; }
	click = selector => { this.$1(selector).click(); return this; } // Fire event only for PF

	// Form Validator
	closeAlerts() {
		alerts.closeAlerts(); // globbal message
		this.elements.forEach(el => el.setOk()); // clear input messages
		return this;
	}
	setErrors(messages) {
		messages.msgError = messages.msgError || this.#opts.defaultMsgError;
		this.elements.eachPrev(el => el.update(messages[el.name]));
		alerts.setMsgs(messages); // show all messages
		return this;
	}
	setError(el, tip, msg) {
		(globalThis.isstr(el) ? this.getElement(el) : el).setError(tip);
		return this.showError(msg); // input error + form error
	}
	setRequired = (el, msg) => this.setError(el, "errRequired", msg);
	setFormatError = (el, msg) => this.setError(el, "errFormat", msg);
}

// For a valid custom element name, it must: Contain a hyphen (-)
customElements.define("model-form", FormHTML, { extends: "form" });
customElements.define("text-input", TextInput, { extends: "input" });
customElements.define("data-list", DataList, { extends: "select" });
customElements.define("float-input", FloatInput, { extends: "input" });
customElements.define("bool-input", BoolInput, { extends: "input" });
customElements.define("date-input", DateInput, { extends: "input" });
customElements.define("time-input", TimeInput, { extends: "input" });
customElements.define("text-area", TextArea, { extends: "textarea" });
customElements.define("file-input", FileInput, { extends: "input" });
customElements.define("btn-form", ButtonForm, { extends: "button" });
