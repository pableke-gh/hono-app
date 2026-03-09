
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

export default class FormHTML extends HTMLFormElement {
	#opts = {
		defaultMsgOk: "saveOk", // default key for message ok
		defaultMsgError: "errForm", // default key error
		refreshSelector: ".form-refresh" // selector for refresh
	};

	constructor() {
		super(); // Must call super before 'this'
		// Form default initialization
		this.setAttribute("novalidate", "1");
		this.afterChange(() => this.setChanged(true)).beforeReset(ev => this.closeAlerts().autofocus());
	}

	// Actions to update form view (inputs, texts, ...)
	#fnQuery = el => globalThis.isstr(el) ? this.$1(el) : el;
	#fnQueryInput = el => globalThis.isstr(el) ? this.getInput(el) : el;
	#fnAction = (el, fn) => { el = this.#fnQueryInput(el); el && fn(el); return this; }
	#fnFor = (list, fn) => { list.forEach(fn); return this; }
	#fnUpdate = (selector, fn) => {
		selector = selector || "input,select,textarea"; // default all input fields
		return this.#fnFor(this.elements, el => el.matches(selector) && fn(el));
	}

	getForm = () => this;
	getOptions = () => this.#opts;
	getNextElement = () => this.nextElementSibling;
	getNext = selector => this.next(selector);
	getElements = () => this.elements;
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
		tabs.nextTab(tab); // go to next tab
		return this;
	}

	eachInput = (selector, fn) => this.#fnUpdate(selector, fn);
	hide = selector => { this.$$(selector).hide(); tabs.setHeight(); return this; }
	show = selector => { this.$$(selector).show(); tabs.setHeight(); return this; }
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
			this.elements.forEach(el => (el.name && fnSetValue(el)));
		else
			this.reset(selector); // clear selected inputs values
		return this;
	}

	getAttr = (selector, name) => this.getElement(selector).getAttribute(name);
	delAttr(selector, name) { this.getElement(selector).removeAttribute(name); return this; }
	setAttr(selector, name, value) { this.getElement(selector).setAttribute(name, value); return this; }

	getUrlParams = () => new URLSearchParams(new FormData(this));
	getFormData(data, include) {
		const fd = new FormDataBox(this);
		return fd.load(data, include); // merge data
	}
	getFormDataInputs(selector) {
		const fd = new FormDataBox(); // partial form
		return fd.setInputs(this.getInputs(selector));
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
}

/*customElements.define("model-form", FormHTML, { extends: "form" });
customElements.define("text-input", TextInput, { extends: "input" });
customElements.define("data-list", DataList, { extends: "select" });
customElements.define("float-input", FloatInput, { extends: "input" });
customElements.define("bool-input", BoolInput, { extends: "input" });
customElements.define("date-input", DateInput, { extends: "input" });
customElements.define("time-input", TimeInput, { extends: "input" });
customElements.define("text-area", TextArea, { extends: "textarea" });
customElements.define("file-input", FileInput, { extends: "input" });
customElements.define("btn-form", ButtonForm, { extends: "button" });*/
