
import alerts from "../../../core/components/alerts/Alerts.js";
import i18n from "../../i18n/langs.js";

// Register the custom element
//customElements.define("text-area", TextArea, { extends: "textarea" });
//Use in HTML: <textarea name="myTextArea" is="text-area" class="ui-input ..." />   
export default class TextArea extends HTMLTextAreaElement {
	constructor() { // Initialize the element
		super(); // Must call super before 'this'
		this.classList.add("ui-input", "ui-ta");
	}

	getValue() { return (this.value && this.value.trim()); }
	setValue(value) { this.value = value || ""; return this; }
	toData(data) { data[this.name] = this.getValue(); return this; }
	toFormData(fd) { fd.append(this.name, this.getValue()); return this; }
	reset() { this.value = ""; return this; }
	restart() { this.focus(); return this.reset(); }

	addListener(name, fn) { this.addEventListener(name, fn); return this; }
	addChange(fn) { return this.addListener("change", fn); }

	hide() { this.parentNode.classList.add("hide"); }
	show() { this.parentNode.classList.remove("hide"); }
	setVisible(visible) { visible ? this.show() : this.hide(); }

	setDisabled(force) { this.classList.toggle("disabled", this.toggleAttribute("disabled", force)); }
	setReadonly(force) { this.classList.toggle("readonly", this.toggleAttribute("readonly", force)); }
	setEditable(force) { this.form.isEditableManual(this) || this.setReadonly(!force); }

	// Input validators
	setOk() {
		delete this.parentNode.dataset.tip; // remove tip-msg
		this.classList.remove(this.form.dataset.errorClass);
	}
	setError(tip, msg) {
		if (tip) // set optional tip-msg
			this.parentNode.dataset.tip = i18n.msg(tip);
		this.classList.add(this.form.dataset.errorClass); // update styles
		alerts.setError(msg); // global message
		this.focus(); // set focus on error
	}
	setRequired(msg) { this.setError("errRequired", msg); }
	setFormatError(msg) { this.setError("errFormat", msg); }

	force(msg) { return (this.value ? !this.setOk() : this.setRequired(msg)); } // force required validation
	validate() { return (this.required ? this.force() : !this.setOk()); } // optional o required with value
}
