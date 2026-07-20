
export default class TextInput extends HTMLInputElement {
	constructor() {
		super(); // Must call super before 'this'
		// Initialize the element
		this.classList.add("ui-input");
	}

	getValue() { return this.value && this.value.trim(); }
	setValue(value) { this.value = value || ""; return this; }
	toData(data) { data[this.name] = this.getValue(); return this; }
	toFormData(fd) { fd.append(this.name, this.getValue()); return this; }
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

	setDisabled(force) { this.classList.toggle("disabled", this.toggleAttribute("disabled", force)); }
	setReadonly(force) { this.classList.toggle("readonly", this.toggleAttribute("readonly", force)); }
	setEditable(force) { this.form.isEditableManual(this) || this.setReadonly(!force); }

	// Validators
	setOk() { this.form.setOk(this); }
	setError(tip, msg) { this.form.setError(this, tip, msg); }
	setRequired(msg) { this.setError("errRequired", msg); }
	setFormatError(msg) { this.setError("errFormat", msg); }
	force(msg) { return (this.value ? !this.setOk() : this.setRequired(msg)); } // force required validation
	validate() { return (this.required ? this.force() : !this.setOk()); } // optional o required with value
}
