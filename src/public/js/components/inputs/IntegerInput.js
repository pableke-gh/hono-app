
import i18n from "../../i18n/langs.js";
import TextInput from "./TextInput.js";
import input from "./FormInput.js";

// Register the custom element
//customElements.define("integer-input", IntegerInput, { extends: "input" });
//Use the custom element by adding the is attribute to a standard <input>:
//<input is="integer-input" type="text" placeholder="Enter text" />   
export default class IntegerInput extends TextInput {
	connectedCallback() {
		// Initialize the element
		this.classList.add("ui-integer");
		this.setAttribute("maxlength", this.getAttribute("maxlength") || 8);
		this.addChange(() => {
			this.value = i18n.fmtInt(this.value); // Show formatted value and style
			const negativeClass = input.getOption("negativeClass"); // get css class name
			this.value && this.classList.toggle(negativeClass, this.value.startsWith("-"));
		});
	}

	getValue = () => i18n.toInt(this.value); // Int type
	setValue(value) {
		this.value = i18n.isoInt(value);
		const negativeClass = input.getOption("negativeClass"); // css class name
		this.value && this.classList.toggle(negativeClass, value < 0);
		return this;
	}

	validate() {
		if (!input.validate(this)) return false; // empty required field
		const ok = (this.getAttribute("required") != "gt0") || (this.getValue() > 0);
		return ok ? this.setOk() : this.setError("errGt0");
	}
}
