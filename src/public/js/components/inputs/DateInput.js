
import sb from "../../components/types/StringBox.js";
import input from "./FormInput.js";
import TextInput from "./TextInput.js";

// Register the custom element
//customElements.define("date-input", DateInput, { extends: "input" });
//Use the custom element by adding the is attribute to a standard <input>:
//<input is="date-input" type="date" />   
export default class DateInput extends TextInput {
	constructor() {
		super(); // Must call super before 'this'
		// Initialize the element
		this.type = "date";
		this.classList.add("ui-date");
	}

	setValue(value) {
		this.value = sb.strDate(value); // yyyy-mm-dd
		this.updateRange(); // is date range => update attributes
		return this;
	}
	validate() {
		return input.validate(this);
	}

	isDate() { return true; } // input type date
	updateRange = () => {} // event handler
	setLimit(el, dt1, dt2) {
		el = globalThis.isstr(el) ? this.form.elements[el] : el;
		this.value = sb.isoDate(dt1);
		el.value = sb.isoDate(dt2);
		this.setAttribute("min", this.value); this.setAttribute("max", el.value);
		el.setAttribute("min", this.value); el.setAttribute("max", el.value);
		return this;
	}
	setRange(el, fnBlur1, fnBlur2) {
		el = globalThis.isstr(el) ? this.form.elements[el] : el; // search by name
		this.addEventListener("blur", ev => { el.setAttribute("min", this.value); fnBlur1 && fnBlur1(ev, this, el); });
		el.addEventListener("blur",   ev => { this.setAttribute("max", el.value); fnBlur2 && fnBlur2(ev, this, el); });
		this.updateRange = () => { el.setAttribute("min", this.value); }; // fired on set value
		el.updateRange = () => { this.setAttribute("max", el.value); }; // fired on set value
		return this.setLimit(el, this.value, el.value);
	}
}
