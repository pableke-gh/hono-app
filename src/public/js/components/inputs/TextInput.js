
import input from "./FormInput.js";

export default class TextInput extends HTMLInputElement {
	constructor() {
		super(); // Must call super before 'this'
		// Initialize the element
		this.classList.add("ui-input");
	}

	getValue = () => (this.value && this.value.trim());
	setValue(value) { this.value = value || ""; return this; }
	load(data) { data[this.name] = this.getValue(); }
	reset() { this.value = ""; return this; }
	restart() { this.focus(); return this.reset(); }

	addChange(fn) { this.addEventListener("change", fn); return this; }
	setDisabled(force) { input.setDisabled(this, force); return this; }
	setReadonly(force) { input.setReadonly(this, force); return this; }
	setEditable = force => this.setReadonly(!force);

	setOk = () => input.setOk(this);
	setError = tip => input.setError(this, tip);
	update = tip => input.update(this, tip);
}

HTMLInputElement.prototype.getValue = function() { return this.value; }
HTMLInputElement.prototype.setValue = function(value) { this.value = value || ""; return this; }
HTMLInputElement.prototype.load = function(data) { data[this.name] = this.getValue(); }
HTMLInputElement.prototype.reset = function() { this.value = ""; return this; }
HTMLInputElement.prototype.restart = function() { this.focus(); return this.reset(); }
HTMLInputElement.prototype.setDisabled = function(force) { input.setDisabled(this, force); return this; }
HTMLInputElement.prototype.setReadonly = function(force) { input.setReadonly(this, force); return this; }
HTMLInputElement.prototype.setEditable = function(force) { return this.setReadonly(!force); }
HTMLInputElement.prototype.setOk = function() { return input.setOk(this); }
HTMLInputElement.prototype.setError = function(tip) { return input.setError(this, tip); }
HTMLInputElement.prototype.update = function(tip) { return input.update(this, tip); }
