
export default class TextInput extends HTMLInputElement {
	constructor() {
		super(); // Must call super before 'this'
		this.dataset.errorClass = this.dataset.errorClass || "ui-error"; // Input error styles
		this.dataset.tipErrorClass = this.dataset.tipErrorClass || "ui-errtip"; // Tip error style

		// Initialize the element
		this.classList.add("ui-input");
	}

	getValue = () => (this.value && this.value.trim());
	setValue(value) { this.value = value || ""; return this; }
	load(data) { data[this.name] = this.getValue(); }
	reset() { this.value = ""; return this; }
	restart() { this.focus(); return this.reset(); }

	addChange(fn) { this.addEventListener("change", fn); return this; }
	setDisabled(force) { this.classList.toggle("disabled", this.toggleAttribute("disabled", force)); return this; }
	setReadonly(force) { this.classList.toggle("readonly", this.toggleAttribute("readonly", force)); return this; }
	setEditable = force => this.setReadonly(!force);

	setOk() {
		this.next("." + this.dataset.tipErrorClass)?.setText("");
		this.classList.remove(this.dataset.errorClass);
		return this;
	}
	setError(tip) {
		this.next("." + this.dataset.tipErrorClass)?.setMsg(tip);
		this.classList.add(this.dataset.errorClass);
		this.focus(); // set focus on error
		return this;
	}
	update(tip) { // tip message is optional
		return tip ? this.setError(tip) : this.setOk();
	}
}

HTMLInputElement.prototype.getValue = function() { return this.value; }
HTMLInputElement.prototype.setValue = function(value) { this.value = value || ""; return this; }
HTMLInputElement.prototype.load = function(data) { data[this.name] = this.getValue(); }
HTMLInputElement.prototype.reset = function() { this.value = ""; return this; }
HTMLInputElement.prototype.restart = function() { this.focus(); return this.reset(); }
HTMLInputElement.prototype.setOk = function() {}
HTMLInputElement.prototype.setError = function(tip) {}
HTMLInputElement.prototype.update = function(tip) {}
