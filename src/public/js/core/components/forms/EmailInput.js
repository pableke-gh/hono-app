
import TextInput from "./TextInput.js";

export default class EmailInput extends TextInput {
	connectedCallback() {
		this.type = "email";
	}

	isEmail() { return true; } // input type email
	validate() {
		const required = this.getAttribute("required");
		if (!required)
			return !this.setOk(); // not required
		if (!this.value) // empty value
			return this.setRequired(); // empty required field
		const ok = !this.value || /\w+[^\s@]+@[^\s@]+\.[^\s@]+/.test(this.value); // optional or has data
		return ok ? !this.setOk() : this.setFormatError();
	}
}
