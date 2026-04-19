
import alerts from "../Alerts.js";

class FormInput {
	#opts; // options container

	getOption = name => this.#opts[name];
	setOptions = data => { this.#opts = data; return this; }

	setDisabled(el, force) { el.classList.toggle("disabled", el.toggleAttribute("disabled", force)); return el; }
	setReadonly(el, force) { el.classList.toggle("readonly", el.toggleAttribute("readonly", force)); return el; }
	setActive(el) { el.classList.remove("readonly"); el.removeAttribute("readonly"); return el; }
	setEditable(el, model) {
		const value = el.dataset.disabled || el.dataset.editable;
		if (value == "manual") return el; // skip evaluation (input manual)
		if (el.dataset.disabled) { // disabled hendler
			const fnDisabled = model[value] || this.#opts[value] || model.isDisabled;
			return el.setDisabled(fnDisabled()); // recalc. disabled attribute by handler
		}
		const fnEditable = model[value] || this.#opts[value] || model.isEditable;
		return el.setReadonly(!fnEditable()); // recalc. readonly attribute by handler
	}
	prepare(el, model) { // recalc. if editable and load value
		el.setEditable(model);
		el.load(model.getData());
		return el;
	}

	// Input Validators
	setOk(input) {
		input.next("." + this.#opts.tipErrorClass)?.setText("");
		input.classList.remove(this.#opts.errorClass);
		return input;
	}
	setError(input, tip, msg) {
		input.next("." + this.#opts.tipErrorClass)?.setMsg(tip);
		input.classList.add(this.#opts.errorClass);
		alerts.showError(msg); // global message
		input.focus(); // set focus on error
		return input;
	}
	setRequired = (el, msg) => this.setError(el, "errRequired", msg);
	setFormatError = (el, msg) => this.setError(el, "errFormat", msg);
	update = (el, tip, msg) => tip ? el.setError(tip, msg) : el.setOk(); // update input state
	validate = el => ((!el.required || el.value) ? el.setOk() : !el.setRequired()); // optional o required with value
}

// Extends HTMLElement prototype
HTMLElement.prototype.eachPrev = function(fn) {
	var el = this.previousElementSibling;
	for (let i = 0; el; el = el.previousElementSibling)
		fn(el, i++);
	return this;
}
HTMLElement.prototype.prev = function(selector) {
	var el = this.previousElementSibling;
	while (el) {
		if (el.matches(selector))
			return el;
		el = el.previousElementSibling;
	}
	return null;
}
HTMLElement.prototype.next = function(selector) {
	var el = this.nextElementSibling;
	while (el) {
		if (el.matches(selector))
			return el;
		el = el.nextElementSibling;
	}
	return null;
}
HTMLElement.prototype.eachNext = function(fn) {
	var el = this.nextElementSibling;
	for (let i = 0; el; el = el.nextElementSibling)
		fn(el, i++);
	return this;
}
HTMLElement.prototype.next = function(selector) {
	var el = this.nextElementSibling;
	while (el) {
		if (el.matches(selector))
			return el;
		el = el.nextElementSibling;
	}
	return null;
}
HTMLElement.prototype.eachSibling = function(fn) {
	return this.eachPrev(fn).eachNext(fn);
}
HTMLElement.prototype.sibling = function(selector) {
	return this.prev(selector) || this.next(selector);
}

export default new FormInput();
