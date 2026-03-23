
import i18n from "../../i18n/langs.js";
import TextInput from "./TextInput.js";

// Register the custom element
//customElements.define("bool-input", BoolInput, { extends: "input" });
//Use the custom element by adding the is attribute to a standard <input>:
//<input is="bool-input" type="text" placeholder="Enter text" />   
export default class BoolInput extends TextInput {
	constructor() {
		super(); // Must call super before 'this'

		// Initialize the element
		this.classList.add("ui-bool");
	}

	getValue() { return this.value; }
	setValue(value) { this.value = i18n.boolval(value); return this; }
}
