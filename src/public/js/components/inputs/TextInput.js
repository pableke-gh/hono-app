
import input from "./FormInput.js";

export default class TextInput extends HTMLInputElement {
	constructor() {
		super(); // Must call super before 'this'
		// Initialize the element
		this.classList.add("ui-input");
	}

	getValue() { return this.value && this.value.trim(); }
	setValue(value) { this.value = value || ""; return this; }
	load(data) { return this.setValue(data[this.name]); }
	toData(data) { data[this.name] = this.getValue(); return this; }
	addFormData(fd) { fd.add(this.name, this.getValue()); return this; }
	reset() { this.value = ""; return this; }
	restart() { this.focus(); return this.reset(); }

	addListener(name, fn) { this.addEventListener(name, fn); return this; }
	addChange(fn) { return this.addListener("change", fn); }

	setDisabled = force => input.setDisabled(this, force);
	setReadonly = force => input.setReadonly(this, force);
	setEditable = model => input.setEditable(this, model);
	prepare = model => input.prepare(this, model);

	setOk = () => input.setOk(this);
	setError = (tip, msg) => input.setError(this, tip, msg);
	setRequired = msg => this.setError("errRequired", msg);
	setFormatError = msg => this.setError("errFormat", msg);
	update = (tip, msg) => input.update(this, tip, msg);
}

// Extends parent class
HTMLInputElement.prototype.getValue = function() { return this.value; }
HTMLInputElement.prototype.setValue = function(value) { this.value = value || ""; return this; }
HTMLInputElement.prototype.load = function(data) { return this.setValue(data[this.name]); }
HTMLInputElement.prototype.toData = function(data) { data[this.name] = this.getValue(); return this; }
HTMLInputElement.prototype.addFormData = function(fd) { fd.add(this.name, this.getValue()); return this; }
HTMLInputElement.prototype.reset = function() { this.value = ""; return this; }
HTMLInputElement.prototype.restart = function() { this.focus(); return this.reset(); }
HTMLInputElement.prototype.setDisabled = function(force) { return input.setDisabled(this, force); }
HTMLInputElement.prototype.setReadonly = function(force) { return input.setReadonly(this, force); }
HTMLInputElement.prototype.setEditable = function(model) { return input.setEditable(this, model); }
HTMLInputElement.prototype.prepare = function(model) { return input.prepare(this, model); }
HTMLInputElement.prototype.setOk = function() { return input.setOk(this); }
HTMLInputElement.prototype.setError = function(tip, msg) { return input.setError(this, tip, msg); }
HTMLInputElement.prototype.update = function(tip, msg) { return input.update(this, tip, msg); }
