
import input from "./FormInput.js";
import TextInput from "./TextInput.js";

export default class EmailInput extends TextInput {
	constructor() {
		super(); // Must call super before 'this'
		// Initialize the element
		this.type = "email";
	}

	isEmail() { return true; } // input type email
	validate() {
		if (!input.validate(this)) return false; // empty required field
		const ok = !this.value || /\w+[^\s@]+@[^\s@]+\.[^\s@]+/.test(this.value); // optional or has data
		return ok ? this.setOk() : !this.setFormatError();
	}
}
