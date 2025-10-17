
import api from "../Api.js";
import tabs from "../Tabs.js";
import alerts from "../Alerts.js";

import dom from "./DomBox.js";
import Input from "./InputBox.js";
import isb from "./SelectBox.js";
import Table from "../Table.js";
import Datalist from "./Datalist.js";
import Autocomplete from "./Autocomplete.js";
import MultiSelectCheckbox from "./MultiSelectCheckbox.js";
import i18n from "../../i18n/langs.js";

export default function(form, opts) {
	form = globalThis.isstr(form) ? document.forms.findBy(form) : form; // Find by name

	opts = opts || {}; // default options
	opts.defaultMsgOk = opts.defaultMsgOk || "saveOk"; // default key for message ok
	opts.defaultMsgError = opts.defaultMsgError || "errForm"; // default key error
	opts.inputErrorClass = opts.inputErrorClass || "ui-error"; // Input error styles
	opts.tipErrorClass = opts.tipErrorClass || "ui-errtip"; // Tip error style
	opts.refreshSelector = opts.refreshSelector || ".form-refresh"; // selector for refresh

	const self = this; //self instance
	const EMPTY = ""; // Empty string
	const INPUTS = "input,select,textarea"; // All input fields
	const FOCUSABLED = "[tabindex]:not([type=hidden],[readonly],[disabled])";
	const input = new Input(opts); // inputs helper
	let _isChanged; // bool indicator

	const $1 = selector => form.querySelector(selector);
	const $$ = selector => form.querySelectorAll(selector);

	this.querySelector = $1; // Form child element
	this.querySelectorAll = $$; // Form children elements
	this.getInput = selector => form.elements.findBy(selector); // find an element
	this.getInputs = selector => form.elements.filterBy(selector); // filter elements

	// Actions to update form view (inputs, texts, ...)
	const fnQuery = el => globalThis.isstr(el) ? $1(el) : el;
	const fnQueryInput = el => globalThis.isstr(el) ? self.getInput(el) : el;
	const fnAction = (el, fn) => { el = fnQueryInput(el); el && fn(el); return self; }
	const fnFor = (list, fn) => { list.forEach(fn); return self; }
	const fnEach = (selector, fn) => fnFor($$(selector), fn);
	const fnUpdate = (selector, fn) => {
		selector = selector || INPUTS; // Default = inputs type
		return fnFor(form.elements, el => el.matches(selector) && fn(el));
	}

	//this.isset = () => form;
	this.getForm = () => form;
	this.getElements = () => form.elements;
	this.getElement = name => form.elements.find(el => (el.name == name));
	this.getValueByName = name => input.val(self.getElement(name));

	this.focus = el => { input.focus(el); return self; }
	this.setFocus = selector => fnAction(selector, el => el.focus());
	this.autofocus = () => self.focus(form.elements.find(el => el.isVisible(FOCUSABLED)));

    this.get = name => opts[name];
    this.set = (name, fn) => { opts[name] = fn; return self; }
	this.isCached = id => (id == opts.cache);
	this.setCache = id => { opts.cache = id; return self; }
	this.resetCache = () => { delete opts.cache; return self; } 
	this.isChanged = () => _isChanged;
	this.setChanged = val => { _isChanged = val; return self; }

	// Alerts helpers
	this.loading = () => { alerts.loading(); return self; } // Encapsule loading frame
	this.working = () => { alerts.working(); return self; } // Encapsule working frame
	this.setOk = () => { alerts.showOk(opts.defaultMsgOk); return self; } // force ok message
	this.showOk = msg => { alerts.showOk(msg); return self; } // Encapsule showOk message
	this.showInfo = msg => { alerts.showInfo(msg); return self; } // Encapsule showInfo message
	this.showWarn = msg => { alerts.showWarn(msg); return self; } // Encapsule showWarn message
	this.showError = msg => { alerts.showError(msg); return self; } // Encapsule showError message
	this.showAlerts = alerts.showAlerts; // showAlerts synonym

	this.getValidators = i18n.getValidation; // validator object
	this.copyToClipboard = dom.copyToClipboard; // to clipboard
	this.getHtml = selector => dom.getHtml(fnQuery(selector));
    this.setHtml = (selector, text) => { dom.html(fnQuery(selector), text); return self; }
	this.html = (selector, text) => { $$(selector).html(text); return self; } // Update all texts info in form
    this.getText = selector => dom.getText(fnQuery(selector));
    this.setText = (selector, text) => { dom.text(fnQuery(selector), text); return self; }
	this.text = (selector, text) => { $$(selector).text(text); return self; } // Update all texts info in form
	this.render = (selector, data) => { $$(selector).render(data); return self; } // NodeList.prototype.render
	this.refresh = (model, selector) => { $$(selector || opts.refreshSelector).refresh(model, opts); return self; } // NodeList.prototype.refresh
	this.send = url => api.setForm(form).send(url || form.action).catch(info => { self.setErrors(info); throw info; });
	this.view = (model, tab) => { // set inputs values and readonly
		self.closeAlerts().setValues(model.getData()).setEditable().refresh(model);
		tabs.viewTab(tab ?? "form"); // show tab and preserve messages
		return self;
	}
	this.nextTab = tab => { // change tab inside form
		if (tab && tabs.isActive(tab)) // same tab
			return self.setOk(); // show ok msg
		tabs.nextTab(tab); // go to next tab
		return self;
	}

	this.hide = selector => { $$(selector).hide(); return self; }
	this.show = selector => { $$(selector).show(); return self; }
	this.setVisible = (selector, force) => force ? self.show(selector) : self.hide(selector);
	this.disabled = (force, selector) => fnUpdate(selector, el => el.setDisabled(force));
	this.readonly = (force, selector) => fnUpdate(selector, el => el.setReadonly(force));
	this.eachInput = (selector, fn) => fnUpdate(selector, fn);
	this.setEditable = selector => fnUpdate(selector, el => {
		const value = /*el.dataset.disabled ||*/ el.dataset.readonly || el.dataset.editable;
		if (value == "manual")
			return; // skip evaluation (input manual)
		/*if (el.dataset.disabled) {
			const fnDisabled = self.get(value) || self.get("is-disabled");
			return el.setDisabled(fnDisabled(el)); // recalc. disabled attribute by handler
		}*/
		if (el.dataset.readonly) {
			const fnReadonly = self.get(value) || self.get("is-readonly");
			return el.setReadonly(fnReadonly(el)); // recalc. readonly attribute by handler
		}
		const fnEditable = self.get(value) || self.get("is-editable");
		el.setReadonly(!fnEditable(el)); // recalc. attribute by handler
	});

	// Value property
	this.setval = (selector, value) => fnAction(selector, el => input.setval(el, value));
	this.setValue = (selector, value) => fnAction(selector, el => input.setValue(el, value));
	this.reset = selector => fnUpdate(selector, el => input.setval(el)); // reset inputs value, hidden to! use :not([type=hidden]) selector
	this.restart = selector => fnAction(selector, el => { el.focus(); input.setval(el); }); // remove value + focus
	this.copy = (el1, el2) => fnAction(el1, el => input.setval(el, self.getval(el2)));
	this.setData = (data, selector) => (data ? fnUpdate(selector, el => input.setValue(el, data[el.name])) : self.reset(selector)).setChanged(); // force changed = false 
	this.setValues = (data, selector) => fnUpdate(selector, el => {
		const value = el.name ? data[el.name] : null; // get value by name
		globalThis.isset(value) && input.setValue(el, value); // update defined data
	});
	this.setDateRange = (f1Selector, f2Selector, fnBlur) => {
		const el1 = fnQueryInput(f1Selector);
		const el2 = fnQueryInput(f2Selector);
		if (el1 && el2) // check if fields exist
			input.setDateRange(el1, el2, fnBlur);
		return self;
	}

	this.getAttr = (selector, name) => input.getAttr(fnQueryInput(selector), name);
	this.delAttr = (selector, name) => { input.delAttr(fnQueryInput(selector), name); return self; }
	this.setAttr = (selector, name, value) => { input.setAttr(fnQueryInput(selector), name, value); return self; }
	this.setAttribute = self.setAttr;

	this.getValue = el => el && input.getValue(el);
	this.getval = selector => input.val(fnQueryInput(selector));
	this.valueOf = selector => self.getValue(fnQueryInput(selector));
	this.loadModel = (model, selector) => fnUpdate(selector, el => model.set(el.name, input.getValue(el)));
	this.setModel = (model, selector) => fnUpdate(selector, el => input.setValue(el, model.get(el.name)));
	this.getData = selector => {
		const data = {}; // Results container
		fnUpdate(selector, el => input.load(el, data));
		return data;
	}
	this.getFormData = (data, include, exclude) => {
		const fd = new FormData(form);
		include.forEach(key => {
			const value = data[key];
			value && fd.set(key, value);
		});
		exclude.forEach(key => fd.delete(key));
		return fd; // merge data to send
	}

	// Inputs helpers
	this.setTable = (selector, opts) => new Table($1(selector), opts); // table
	this.stringify = (selector, data, replacer) => self.setval(selector, JSON.stringify(data, replacer)).setChanged(true);
	this.saveTable = (selector, table, replacer) => self.stringify(selector, table.getData(), replacer);
	this.getOptionText = selector => isb.getOptionText(fnQueryInput(selector));
	this.getOptionTextByValue = (selector, value) => isb.getOptionTextByValue(fnQueryInput(selector), value);
	this.select = (selector, mask) => { isb.select(fnQueryInput(selector), mask); return self; }
	this.setDatalist = (selector, opts) => new Datalist($1(selector), opts); // select / optgroup
	this.setItems = (selector, items, emptyOption) => fnUpdate(selector, el => isb.setItems(el, items, emptyOption));
	this.setOptions = (selector, data, emptyOption) => fnUpdate(selector, el => isb.setData(el, data, emptyOption));
	this.setLabels = (selector, labels, emptyOption) => fnUpdate(selector, el => isb.setLabels(el, labels, emptyOption));
	this.setMultiSelectCheckbox = (selector, opts) => new MultiSelectCheckbox($1(selector), opts); // multi select checkbox
	this.setAutocomplete = (selector, opts) => new Autocomplete(fnQueryInput(selector), opts); // Input type text / search

	const fnItems = (source, afterSelect, onReset) => ({ minLength: 4, source, render: item => item.label, select: item => item.value, afterSelect, onReset });
	this.loadAcItems = (selector, fnSource, fnSelect, fnReset) => fnUpdate(selector, el => new Autocomplete(el, fnItems(fnSource, fnSelect, fnReset)));
	this.setAcItems = (selector, fnSource, fnSelect, fnReset) => self.setAutocomplete(selector, fnItems(fnSource, fnSelect, fnReset));
	this.showModal = selector => $1(selector).showModal();
	this.closeModal = () => $1("dialog[open]").close();

	// Events handlers
	const fnEvent = (el, name, fn) => { el.addEventListener(name, ev => fn(ev, el)); return self; }
	const fnChange = (el, fn) => fnEvent(el, "change", fn);

	this.afterChange = fn => fnChange(form, fn); // add change event handler
	this.onKeydown = fn => fnEvent(form, "keydown", fn); // add event handler
	this.onSubmit = fn => fnEvent(form, "submit", fn); // add event handler
	this.fire = action => (self.get(action)()); // fire manual handler
	this.fireSubmit = () => { form.submit(); return self; } // force submit
	this.fireReset = () => { form.reset(); return self; }
	this.beforeReset = fn => fnEvent(form, "reset", fn);
	this.afterReset = fn => fnEvent(form, "reset", ev => setTimeout(() => fn(ev), 1));

	this.addClickAll = (selector, fn) => fnEach(selector, el => el.addClick(fn));
	this.addClick = (selector, fn) => { dom.addAction($1(selector), fn); return self; }
	this.setClickAll = (selector, fn) => fnEach(selector, el => el.setClick(fn));
	this.setClick = (selector, fn) => { dom.setAction($1(selector), fn); return self; }
	this.click = selector => { $1(selector).click(); return self; } // Fire event only for PF

	this.onChange = (selector, fn) => fnAction(selector, el => fnChange(el, fn));
	this.onChangeInputs = (selector, fn) => fnUpdate(selector, el => fnChange(el, fn));
	this.onChangeInput = self.onChange; // synonym

	this.onChangeFile = (selector, fn) => fnAction(selector, el => input.file(el, fn));
	this.onChangeFiles = (selector, fn) => fnUpdate(selector, el => input.file(el, fn));
	this.setField = (selector, value, fn) => fnAction(selector, el => { fnChange(el, fn); input.setValue(el, value); }); 

	// Form Validator
	this.closeAlerts = () => {
		alerts.closeAlerts(); // globbal message
		form.elements.forEach(el => el.classList.remove(opts.inputErrorClass));
		form.getElementsByClassName(opts.tipErrorClass).text(EMPTY);
		return self;
	}
	this.setErrors = messages => {
		if (globalThis.isstr(messages)) // simple message text
			return self.showError(messages); // show error message
		const valid = self.getValidators(); // get form validators
		// Style error inputs and set focus on first error
		messages = messages || valid.getMsgs(); // default messages
		form.elements.eachPrev(el => input.setError(el, messages[el.name]));
		self.showError(messages.msgError || opts.defaultMsgError);
		valid.reset(); // reset for next validation
		return self;
	}
	this.validate = (fnValidator, selector) => {
		const data = self.closeAlerts().getData(selector); // current form data
		return fnValidator(data) ? data : !self.setErrors(); // model preserve this
	}

	this.update = () => { // Form initialization
		form.elements.forEach(input.init);
		return self.autofocus();
	}

	// Form initialization
	form.setAttribute("novalidate", "1");
	self.update().afterChange(() => { _isChanged = true; }).beforeReset(ev => self.closeAlerts().autofocus());
}
