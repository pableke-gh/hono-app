
import i18n from "../../i18n/langs.js";
import TextInput from "./TextInput.js";
import input from "./FormInput.js";

// Register the custom element
//customElements.define("float-input", FloatInput, { extends: "input" });
//Use the custom element by adding the is attribute to a standard <input>:
//<input is="float-input" type="text" placeholder="Enter text" />   
export default class FloatInput extends TextInput {
	connectedCallback() {
		// Initialize the element
		this.classList.add("ui-float");
		this.classList.remove("ui-inputfield");
		this.setAttribute("maxlength", this.getAttribute("maxlength") || 12);
		this.addChange(() => {
			this.value = i18n.fmtFloat(this.value); // Show formatted value and style
			const negativeClass = input.getOption("negativeClass"); // css class name
			this.value && this.classList.toggle(negativeClass, this.value.startsWith("-"));
		});
	}

	getValue = () => i18n.toFloat(this.value); // Float type
	setValue(value) {
		this.value = i18n.isoFloat(value); // formatted value
		const negativeClass = input.getOption("negativeClass"); // css class name
		this.value && this.classList.toggle(negativeClass, value < 0);
		return this;
	}

	validate() {
		if (!super.validate()) return false; // empty required field
		const gt0Class = input.getOption("gt0Class"); // css class name
		const ok = !this.classList.contains(gt0Class) || (this.getValue() > 0);
		return ok ? this.setOk() : this.setError("errGt0");
	}
}
