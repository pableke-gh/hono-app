
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

	isDate() { return (this.type == "date"); } // input type date
	isEmail() { return (this.type == "email"); } // input type email
	isAutocomplete() { return (this.type == "search"); } // input type autocomplete
	isBool() { return (this.classList.contains("ui-bool")); } // boolean input
	isFile() { return (this.type == "file"); } // input type file

	addListener(name, fn) { this.addEventListener(name, fn); return this; }
	addChange(fn) { return this.addListener("change", fn); }

	hide() { this.parentNode.classList.add("hide"); }
	show() { this.parentNode.classList.remove("hide"); }
	setVisible(visible) { visible ? this.show() : this.hide(); }

	setDisabled(force) { return input.setDisabled(this, force); }
	setReadonly(force) { return input.setReadonly(this, force); }
	setEditable(model) { return input.setEditable(this, model); }
	prepare(model) { return input.prepare(this, model); }

	// Input text Validators
	setOk() { return input.setOk(this); }
	setError(tip, msg) { return input.setError(this, tip, msg); }
	setRequired(msg) { return input.setRequired(this, msg); }
	setFormatError(msg) { return input.setFormatError(this, msg); }
	update(tip, msg) { return input.update(this, tip, msg); }
	force(msg) { return input.required(this, msg); } // force required validation
	validate() { return input.validate(this); } // optional o required with value
}
