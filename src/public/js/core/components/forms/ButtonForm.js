
/**
 * The type attribute on an HTML <button> element defines the button's behavior when activated.  It accepts three values:
 * 
 * button: Creates a clickable button with no default behavior. It requires JavaScript to define its functionality.
 * submit: Makes the button submit the form data to the server. This is the default behavior if no type is specified. 
 * reset: Resets all form fields to their initial values when clicked.
 * 
 * Important: If the type attribute is omitted, the button defaults to submit, which can cause unintended form submissions.
 * Always explicitly define the type to avoid bugs and improve code clarity.
 * 
 * Best practice: Use type="button" for non-form actions, type="submit" for form submission, and type="reset" only when resetting form data.
 */
export default class ButtonForm extends HTMLButtonElement {
	//getValue() {}
	setValue() {} // not to set value
	toData(data) {} // not set value in data
	toFormData(fd) {} // not append values in form data

	reset() {}
	restart() {}

	hide() { this.classList.add("hide"); } // hide button
	show() { this.classList.remove("hide"); } // show button
	setVisible(visible) { visible ? this.show() : this.hide(); }

	setDisabled(force) { this.classList.toggle("disabled", this.toggleAttribute("disabled", force)); return this; }
	setReadonly(force) { this.classList.toggle("readonly", this.toggleAttribute("readonly", force)); return this; }
	setEditable() { return this; } // preserve state by default, override in child class

	// Validators
	setOk() {} // restore default styles
	setError() {} // set css class error
	validate() { return true; } // default validation

	execute() { // override in subclass
		console.error("Execute method must be implemented!");
	}

	connectedCallback() { // init. component
		this.classList.add("btn"); // default button class
		this.addEventListener("click", ev => {
			ev.preventDefault(); // avoid page reload
			this.execute(); // execute action
		});
	}

	/* deprecated functions, preserve for old compatibility */
	load(data) {} // deprecated: old compatibility
	prepare(model) { this.setEditable(); } // deprecated: old compatibility
	update(tip, msg) {} // deprecated: old compatibility
	addFormData(fd) {} // not append values in form data
	/* deprecated functions, preserve for old compatibility */
}
