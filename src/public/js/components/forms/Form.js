
import api from "../Api.js";
import alerts from "../Alerts.js";
import dom from "./DomBox.js";
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

	opts.dateClass = opts.dateClass || "ui-date"; // Date type
	opts.boolClass = opts.boolClass || "ui-bool"; // Boolean type
	opts.checkAllClass = opts.checkAllClass || "ui-check-all"; // Check all related checkboxes
	opts.floatFormatClass = opts.floatFormatClass || "ui-float"; // Float i18n
	opts.integerFormatClass = opts.integerFormatClass || "ui-integer"; // Integer i18n
	opts.numberFormatClass = opts.numberFormatClass || "ui-number"; // Number type
	opts.inputErrorClass = opts.inputErrorClass || "ui-error"; // Input error styles
	opts.tipErrorClass = opts.tipErrorClass || "ui-errtip"; // Tip error style
	//opts.groupSelector = opts.groupSelector || "label"; // Parent container (ej: .ui-group)
	opts.negativeNumClass = opts.negativeNumClass || "text-red"; // Negative numbers styles

	const self = this; //self instance
	const EMPTY = ""; // Empty string
	const INPUTS = "input,select,textarea"; // All input fields
	const FOCUSABLED = "[tabindex]:not([type=hidden],[readonly],[disabled])";

	const $1 = selector => form.querySelector(selector);
	const $$ = selector => form.querySelectorAll(selector);

	this.querySelector = $1; // Form child element
	this.querySelectorAll = $$; // Form children elements
	this.getInput = selector => form.elements.findBy(selector); // find an element
	this.getInputs = selector => form.elements.query(selector); // filter elements

	// Actions to update form view (inputs, texts, ...)
	const fnQueryInput = el => globalThis.isstr(el) ? self.getInput(el) : el;
	const fnAction = (el, fn) => { el = fnQueryInput(el); el && fn(el); return self; }
	const fnContains = (el, name) => el.classList.contains(name);
	const fnFor = (list, fn) => { list.forEach(fn); return self; }
	const fnEach = (selector, fn) => fnFor($$(selector), fn);
	const fnUpdate = (selector, fn) => {
		selector = selector || INPUTS; // Default = inputs type
		return fnFor(form.elements, el => el.matches(selector) && fn(el));
	}

	this.isset = () => form;
	this.getForm = () => form;
	this.getElements = () => form.elements;
	//this.getId = () => form.id.value;
	this.focus = el => { dom.focus(el); return self; }
	this.setFocus = selector => fnAction(selector, el => el.focus());
	this.autofocus = () => self.focus(form.elements.find(el => el.isVisible(FOCUSABLED)));

    this.get = name => opts[name];
    this.set = (name, fn) => { opts[name] = fn; return self; }
	this.setCache = id => { opts.cache = id; return self; }
	this.isCached = (id, selector) => ((id == opts.cache) || (id == self.getval(selector || "#id")));
	this.resetCache = selector => { delete opts.cache; return self.setStrval(selector || "#id"); }

	// Alerts helpers
	this.loading = () => { alerts.loading(); return self; } // Encapsule loading frame
	this.working = () => { alerts.working(); return self; } // Encapsule working frame
	this.showOk = msg => { alerts.showOk(msg); return self; } // Encapsule showOk message
	this.showInfo = msg => { alerts.showInfo(msg); return self; } // Encapsule showInfo message
	this.showWarn = msg => { alerts.showWarn(msg); return self; } // Encapsule showWarn message
	this.showError = msg => { alerts.showError(msg); return self; } // Encapsule showError message
	this.showAlerts = data => { alerts.showAlerts(data); return self; } // Encapsule showAlerts message

	this.getHtml = selector => dom.getHtml($1(selector));
    this.setHtml = (el, text) => { dom.html(el, text); return self; }
	this.html = (selector, text) => { $$(selector).html(text); return self; } // Update all texts info in form
    this.getText = selector => dom.getText($1(selector));
    this.setText = (el, text) => { dom.text(el, text); return self; }
	this.text = (selector, text) => { $$(selector).text(text); return self; } // Update all texts info in form
	this.render = (selector, data) => { $$(selector).render(data); return self; } // HTMLElement.prototype.render
	this.copyToClipboard = dom.copyToClipboard; // to clipboard

	this.hide = selector => { $$(selector).hide(); return self; }
	this.show = selector => { $$(selector).show(); return self; }
	this.setVisible = (selector, force) => force ? self.show(selector) : self.hide(selector);
	this.disabled = (force, selector) => fnUpdate(selector, el => el.setDisabled(force));
	this.readonly = (force, selector) => fnUpdate(selector, el => el.setReadonly(force));
	this.eachInput = (selector, fn) => fnUpdate(selector, fn);

	// Value property
	const isSelect = el => (el.tagName == "SELECT");
	const isCheckbox = el => (el.type == "checkbox");
	const fnNumber = (el, value) => {
		el.value = value || EMPTY; // Show formatted value and style
		el.classList.toggle(opts.negativeNumClass, el.value.startsWith("-"));
	}
	function fnSetval(el, value) {
		if ((el.tagName == "SELECT") && !value)
			el.selectedIndex = 0; // first option
		else
			el.value = value || ""; // force String
		return self;
	}
	function fnSetValue(el, value) {
		if (el.type =="date") // input type = date
			el.value = value ? value.substring(0, 10) : EMPTY;
		else if (fnContains(el, opts.floatFormatClass))
			fnNumber(el, i18n.isoFloat(value));
		else if (fnContains(el, opts.integerFormatClass))
			fnNumber(el, i18n.isoInt(value));
		else if (fnContains(el, opts.boolClass))
			el.value = i18n.boolval(value);
		else if (isCheckbox(el)) // Array type
			el.checked = value && value.includes(el.value);
		else if (el.type === "radio")
			el.checked = (el.value == value);
		else
			fnSetval(el, value)
		return self;
	}
	this.setValue = (el, value) => el ? fnSetValue(el, value) : self;
	this.setval = (selector, value) => fnAction(selector, el => fnSetValue(el, value));
	this.setStrval = (selector, value) => fnAction(selector, el => fnSetval(el, value));
	this.values = (selector, value) => fnUpdate(selector, el => fnSetValue(el, value));
	this.setData = (data, selector) => fnUpdate(selector, el => fnSetValue(el, data[el.name]));

	this.getAttr = (selector, name) => dom.getAttr(fnQueryInput(selector), name);
	this.delAttr = (selector, name) => { dom.delAttr(fnQueryInput(selector), name); return self; }
	this.setAttr = (selector, name, value) => { dom.setAttr(fnQueryInput(selector), name, value); return self; }
	this.setAttribute = self.setAttr;

	function fnParseValue(el) {
		if (fnContains(el, opts.floatFormatClass))
			return i18n.toFloat(el.value); // Float
		if (fnContains(el, opts.integerFormatClass))
			return i18n.toInt(el.value); // Integer
		if (fnContains(el, opts.numberFormatClass))
			return el.value ? +el.value : null; // Number type directly
		return el.value && el.value.trim(); // String trimed by default
	}
	this.getValue = el => el && fnParseValue(el);
	this.getval = selector => dom.getValue(fnQueryInput(selector));
	this.valueOf = selector => self.getValue(fnQueryInput(selector));
	this.getData = selector => { // View to JSON
		const data = {}; // Results container
		fnUpdate(selector, el => {
			if (!el.name)
				return; // No value to save
			if (isCheckbox(el) && el.checked) {
				data[el.name] = data[el.name] || [];
				data[el.name].push(el.value); // Array type
				return;
			}
			if (isSelect(el))
				data[el.name + "Option"] = dom.getOptionText(el);
			data[el.name] = fnParseValue(el);
		});
		return data;
	}

	this.reset = selector => fnUpdate(selector, el => fnSetval(el)); // reset inputs value, hidden to! use :not([type=hidden]) selector
	this.restart = selector => fnAction(selector, el => { el.focus(); fnSetval(el); }); // remove value + focus
	this.copy = (el1, el2) => fnAction(el1, el => fnSetval(el, self.getval(el2)));

	// Inputs helpers
	this.setTable = (selector, opts) => new Table($1(selector), opts); // table
	this.stringify = (selector, data, replacer) => self.setStrval(selector, JSON.stringify(data, replacer));
	this.saveTable = (selector, table, replacer) => self.stringify(selector, table.getData(), replacer);
	this.getOptionText = selector => dom.getOptionText(self.getInput(selector));
	this.select = (selector, mask) => { dom.select(fnQueryInput(selector), mask); return self; }
	this.setDatalist = (selector, opts) => new Datalist($1(selector), opts); // select / optgroup
	this.setMultiSelectCheckbox = (selector, opts) => new MultiSelectCheckbox($1(selector), opts); // multi select checkbox
	this.setAutocomplete = (selector, opts) => new Autocomplete(fnQueryInput(selector), opts); // Input type text / search

	const fnAcOptions = (fnSource, fnSelect, fnReset) => {
		return { minLength: 4, source: fnSource, render: item => item.label, select: item => item.value, afterSelect: fnSelect, onReset: fnReset };
	}
	this.setAcItems = (selector, fnSource, fnSelect, fnReset) => self.setAutocomplete(selector, fnAcOptions(fnSource, fnSelect, fnReset));
	this.loadAcItems = (selector, fnSource, fnSelect, fnReset) => fnUpdate(selector, el => new Autocomplete(el, fnAcOptions(fnSource, fnSelect, fnReset)));

	// Events handlers
	const fnEvent = (el, name, fn) => { el.addEventListener(name, ev => fn(ev, el)); return self; }
	const fnChange = (el, fn) => fnEvent(el, "change", fn);

	this.setDateRange = (f1, f2) => {
		f1 = fnQueryInput(f1);
		f2 = fnQueryInput(f2);
		if (f1 && f2) { // check if fields exist
			fnEvent(f1, "blur", ev => f2.setAttribute("min", f1.value));
			fnEvent(f2, "blur", ev => f1.setAttribute("max", f2.value));
			f1.setAttribute("max", f2.value);
			f2.setAttribute("min", f1.value);
		}
		return self;
	}

	this.afterChange = fn => fnChange(form, fn);
	this.onSubmit = fn => fnEvent(form, "submit", fn);
	this.fireSubmit = () => { form.submit(); return self; }
	this.fireReset = () => { form.reset(); return self; }
	this.beforeReset = fn => fnEvent(form, "reset", fn);
	this.afterReset = fn => fnEvent(form, "reset", ev => setTimeout(() => fn(ev), 1));

	this.addClickAll = (selector, fn) => fnEach(selector, el => el.addClick(fn));
	this.addClick = (selector, fn) => { dom.addAction($1(selector), fn); return self; }
	this.setClickAll = (selector, fn) => fnEach(selector, el => el.setClick(fn));
	this.setClick = (selector, fn) => { dom.setAction($1(selector), fn); return self; }
	this.click = selector => { $1(selector).click(); return self; } // Fire event only for PF

	this.onChange = (selector, fn) => fnAction(selector, el => fnChange(el, fn));
	this.onChangeInput = self.onChange;
	this.onChangeInputs = (selector, fn) => fnUpdate(selector, el => fnChange(el, fn));

	const fnChangeFile = (el, fn) => {
		let file, index = 0; // file, position;
		const reader = new FileReader();
		const fnLoad = i => {
			file = el.files[i]; // multifile
			file && reader.readAsArrayBuffer(file); //reader.readAsText(file, "UTF-8");
		}
		reader.onload = ev => { // event on load file
			fn(el, file, reader.result, index);
			fnLoad(++index);
		}
		el.addEventListener("change", () => fnLoad(index));
		return self; // self instance
	}
	this.onChangeFile = (selector, fn) => fnAction(selector, el => fnChangeFile(el, fn));
	this.onChangeFiles = (selector, fn) => fnUpdate(selector, el => fnChangeFile(el, fn));
	this.setField = (selector, value, fn) => fnAction(selector, el => { fnChange(el, fn); fnSetValue(el, value); }); 

	// Form Validator
	const fnSetError = (el, tip) => {
		if (!tip) return; // no message
		el.focus(); // set focus on error
		el.classList.add(opts.inputErrorClass);
		dom.text(el.next("." + opts.tipErrorClass), i18n.get(tip));
	}
	this.closeAlerts = () => {
		alerts.closeAlerts(); // globbal message
		form.elements.forEach(el => el.classList.remove(opts.inputErrorClass));
		form.getElementsByClassName(opts.tipErrorClass).text(EMPTY);
		return self;
	}
	this.setErrors = messages => {
		if (globalThis.isstr(messages)) // simple message text
			return self.showError(messages);
		// Style error inputs and set focus on first error
		messages = messages || i18n.getValidation().getMsgs(); // default messages
		form.elements.eachPrev(el => fnSetError(el, messages[el.name]));
		return self.showError(messages.msgError || opts.defaultMsgError);
	}
	this.validate = (fnValidator, selector) => {
		const data = self.closeAlerts().getData(selector); // current form data
		return fnValidator(data) ? data : !self.setErrors(); // model preserve this
	}

	this.send = async url => {
		const fd = new FormData(form); // Data container
		const body = (form.enctype == "multipart/form-data") ? fd : new URLSearchParams(fd);
		return await api.init().setMethod(form.method).setBody(body)
						.send(url || form.action)
						.catch(info => { self.setErrors(info); throw info; });
	}

	this.update = () => { // Form initialization
		form.elements.forEach(el => { // update inputs
			if (fnContains(el, opts.floatFormatClass)) {
				fnChange(el, ev => fnNumber(el, i18n.fmtFloat(el.value)));
				return fnNumber(el, el.value && i18n.isoFloat(+el.value)); // iso format float
			}
			if (fnContains(el, opts.integerFormatClass)) {
				fnChange(el, ev => fnNumber(el, i18n.fmtInt(el.value)));
				return fnNumber(el, el.value && i18n.isoInt(+el.value)); // iso format integer
			}
			if (fnContains(el, opts.boolClass))
				el.value = i18n.boolval(el.value); // Hack PF type
			else if (fnContains(el, opts.dateClass))
				el.type = "date"; // Hack PF type
			else if (fnContains(el, opts.checkAllClass))
				el.addEventListener("click", ev => {
					const fnCheck = input => (isCheckbox(input) && (input.name == el.id));
					form.elements.forEach(input => { if (fnCheck(input)) input.checked = el.checked; });
				});
		});
		return self.autofocus();
	}

	if (form) { // Form initialization
		form.setAttribute("novalidate", "1");
		self.update().beforeReset(ev => self.closeAlerts().autofocus());
	}
}
