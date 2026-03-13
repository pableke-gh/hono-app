
import alerts from "../Alerts.js";

class FormInput {
	#opts = {
		errorClass: "ui-error", // Input error styles
		tipErrorClass: "ui-errtip", // Tip error style
		negativeClass: "text-red" // Negative numbers styles
	};

	getOptions = () => this.#opts;
	getOption = name => this.#opts[name];
	setOptions = data => { Object.assign(this.#opts, data); return this; }

	setDisabled = (el, force) => el.toggle("disabled", el.toggleAttribute("disabled", force));
	setReadonly = (el, force) => el.toggle("readonly", el.toggleAttribute("readonly", force));
	setEditable = (el, force) => this.setReadonly(el, !force);

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
	update(input, tip, msg) { // tip message is optional
		return tip ? this.setError(input, tip, msg) : this.setOk(input);
	}
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
