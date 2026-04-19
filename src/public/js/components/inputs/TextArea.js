
import input from "./FormInput.js";

// Register the custom element
//customElements.define("text-area", TextArea, { extends: "textarea" });
//Use in HTML: <textarea name="myTextArea" is="text-area" class="ui-input ..." />   
export default class TextArea extends HTMLTextAreaElement {
	constructor() {
		super(); // Must call super before 'this'
		// Initialize the element
		this.classList.add("ui-input", "ui-ta");
	}

	getValue() { return (this.value && this.value.trim()); }
	setValue(value) { this.value = value || ""; return this; }
	load(data) { return this.setValue(data[this.name]); }
	toData(data) { data[this.name] = this.getValue(); return this; }
	addFormData(fd) { fd.add(this.name, this.getValue()); return this; }
	reset() { this.value = ""; return this; }
	restart() { this.focus(); return this.reset(); }

	addListener(name, fn) { this.addEventListener(name, fn); return this; }
	addChange(fn) { return this.addListener("change", fn); }

	setDisabled(force) { return input.setDisabled(this, force); }
	setReadonly(force) { return input.setReadonly(this, force); }
	setEditable(model) { return input.setEditable(this, model); }
	prepare(model) { return input.prepare(this, model); }

	// Input Validators
	setOk() { return input.setOk(this); }
	setError(tip, msg) { return input.setError(this, tip, msg); }
	setRequired(msg) { return input.setRequired(this, msg); }
	setFormatError(msg) { return input.setFormatError(this, msg); }
	update(tip, msg) { return input.update(this, tip, msg); }
	validate() { return input.validate(this); }
}
