
import input from "./FormInput.js";

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
	load(data) {} // not to load value
	toData(data) {} // not set value in data
	addFormData(fd) {} // not append values in form data

	reset() {}
	restart() {}

	setDisabled(force) { return input.setDisabled(this, force); } // button attribute
	setReadonly(force) { return input.setDisabled(this, force); } // readonly = disbled
	setEditable() { return this; } // preserve state by default, override in child class
	prepare() { return this.setEditable(); } // button not to load data

	// Validators
	setOk() { return this; } // restore default styles
	setError() { return this; } // set css class error
	update() { return this; } // deprecated
	validate() { return true; }

	connectedCallback() { // init. component
		if (this.execute) // execute action on click or default button behavior
			this.addEventListener("click", ev => { ev.preventDefault(); this.execute(); });
		this.classList.add("btn"); // default button class
	}
}
