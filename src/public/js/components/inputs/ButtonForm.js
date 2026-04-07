
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

	setDisabled = force => input.setDisabled(this, force); // button attribute
	setReadonly = force => input.setDisabled(this, force); // readonly = disbled
	setEditable = model => input.setEditable(this, model); // recalc. if button is clicable
	prepare = model => input.setEditable(this, model); // button not to load data

	setOk() {}
	setError() {}
	update() {}
}

HTMLButtonElement.prototype.getValue = function() { return this.value; }
HTMLButtonElement.prototype.setValue = function(value) {}
HTMLButtonElement.prototype.load = function() {}
HTMLButtonElement.prototype.toData = function() {}
HTMLButtonElement.prototype.addFormData = function() {}
HTMLButtonElement.prototype.reset = function() {}
HTMLButtonElement.prototype.restart = function() {}
HTMLButtonElement.prototype.setDisabled = function(force) { return input.setDisabled(this, force); } // button attribute
HTMLButtonElement.prototype.setReadonly = function(force) { return this.setDisabled(force); } // attribute readonly = disbled
HTMLButtonElement.prototype.setEditable = function(model) { return input.setEditable(this, model); } // recalc. if button is clicable
HTMLButtonElement.prototype.prepare = function(model) { return input.prepare(this, model); } // button not to load data
HTMLButtonElement.prototype.setOk = function() {}
HTMLButtonElement.prototype.setError = function(tip, msg) {}
HTMLButtonElement.prototype.update = function(tip, msg) {}
