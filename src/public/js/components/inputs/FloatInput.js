
import i18n from "../../i18n/langs.js";
import TextInput from "./TextInput.js";

// Register the custom element
//customElements.define("float-input", FloatInput, { extends: "input" });
//Use the custom element by adding the is attribute to a standard <input>:
//<input is="float-input" type="text" placeholder="Enter text" />   
export default class FloatInput extends TextInput {
	constructor() {
		super(); // Must call super before 'this'
		this.dataset.negativeClass = this.dataset.negativeClass || "text-red"; // Negative numbers styles

		// Initialize the element
		this.classList.add("ui-float");
		this.classList.remove("ui-inputfield");
		this.setAttribute("maxlength", this.getAttribute("maxlength") || 12);

		const format = () => {
			this.value = i18n.fmtFloat(this.value); // Show formatted value and style
			this.value && this.classList.toggle(this.dataset.negativeClass, this.value.startsWith("-"));
		}
		this.addChange(format);
		format();
	}

	getValue = () => i18n.toFloat(this.value); // Float type
	setValue(value) { this.value = i18n.isoFloat(value); return this; }
	load(data) { data[this.name] = this.getValue(); }

	/*connectedCallback() {
		console.log(this.name, "FloatInput connected to DOM");
	}*/
}
