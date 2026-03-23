
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

	getValue = () => (this.value && this.value.trim());
	setValue(value) { this.value = value || ""; return this; }
	load(data) { return this.setValue(data[this.name]); }
	toData(data) { data[this.name] = this.getValue(); return this; }
	addFormData(fd) { fd.append(this.name, this.getValue()); return this; }
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
