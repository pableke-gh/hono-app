
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
	setValue() {}
	load(data) {}
	toData(data) {}
	addFormData(fd) {}

	reset() {}
	restart() {}
	execute() { throw new Error("Method 'execute' must be implemented."); }
	setExecutable() { this.addEventListener("click", ev => { ev.preventDefault(); this.execute(); }); }

	setDisabled(force) { return input.setDisabled(this, force); } // button attribute
	setReadonly(force) { return input.setDisabled(this, force); } // readonly = disbled
	setEditable(model) { return input.setEditable(this, model); } // recalc. if button is clicable
	prepare(model) { return input.setEditable(this, model); } // button not to load data

	// Validators
	setOk() { return this; } // restore default styles
	setError() { return this; } // set css class error
	update() { return this; } // deprecated
	validate() { return true; }
}
