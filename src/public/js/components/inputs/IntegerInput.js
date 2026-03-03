
import i18n from "../../i18n/langs.js";
import TextInput from "./TextInput.js";

// Register the custom element
//customElements.define("integer-input", IntegerInput, { extends: "input" });
//Use the custom element by adding the is attribute to a standard <input>:
//<input is="integer-input" type="text" placeholder="Enter text" />   
export default class IntegerInput extends TextInput {
	constructor() {
		super(); // Must call super before 'this'
		this.dataset.negativeClass = this.dataset.negativeClass || "text-red"; // Negative numbers styles

		// Initialize the element
		this.classList.add("ui-integer");
		this.setAttribute("maxlength", this.getAttribute("maxlength") || 8);

		const format = () => {
			this.value = i18n.fmtInt(this.value); // Show formatted value and style
			this.value && this.classList.toggle(this.dataset.negativeClass, this.value.startsWith("-"));
		}
		this.addChange(format);
		format();
	}

	getValue = () => i18n.toInt(this.value); // Int type
	setValue(value) {
		this.value = i18n.isoInt(value);
		return this;
	}

	/*connectedCallback() {
		console.log(this.name, "IntegerInput connected to DOM");
	}*/
}
