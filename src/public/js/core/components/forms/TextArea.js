
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
	toData(data) { data[this.name] = this.getValue(); return this; }
	toFormData(fd) { fd.add(this.name, this.getValue()); return this; }
	reset() { this.value = ""; return this; }
	restart() { this.focus(); return this.reset(); }

	addListener(name, fn) { this.addEventListener(name, fn); return this; }
	addChange(fn) { return this.addListener("change", fn); }

	setDisabled(force) { this.classList.toggle("disabled", this.toggleAttribute("disabled", force)); return this; }
	setReadonly(force) { this.classList.toggle("readonly", this.toggleAttribute("readonly", force)); return this; }
	setEditable(force) { return this.setReadonly(!force); }

	// Input Validators
	setOk() { this.form.setOk(this); }
	setError(tip, msg) { this.form.setError(this, tip, msg); }
	setRequired(msg) { this.setError("errRequired", msg); }
	setFormatError(msg) { this.setError("errFormat", msg); }
	force(msg) { return (this.value ? this.setOk() : !this.setRequired(msg)); } // force required validation
	validate() { return (this.required ? this.force() : this.setOk()); } // optional o required with value
}
