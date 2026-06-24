
import alerts from "../helper/Alerts.js";
import i18n from "../../i18n/langs.js";
import observer from "../../util/Observer.js";

import DataList from "./DataList.js";
import TextInput from "./TextInput.js";
import DateInput from "./DateInput.js";
import FloatInput from "./FloatInput.js";
import EmailInput from "./EmailInput.js";
import FileInput from "./FileInput.js";
import TextArea from "./TextArea.js";
import CheckInput from "./CheckInput.js";
import ButtonForm from "./ButtonForm.js";

export default class FormHTML extends HTMLFormElement {
	#isChanged; #table; #data;

	isEmpty = () => !this.#data;
	isLoaded = () => !!this.#data;
	isChanged = () => this.#isChanged;
	setChanged(val) { this.#isChanged = val; return this; }
	isCached = id => (this.isLoaded() && (id == this.#data.id));

	getTable = () => this.#table;
	setTable = table => { this.#table = table; return this; }

	getElements = () => this.elements;
	getElement = name => this.elements[name];
	getInputs = selector => this.elements.filter(el => el.matches(selector));

	setFocus(input) {
		input = globalThis.isstr(input) ? this.elements[input] : input;
		input.focus();
		return this;
	}
	copyToClipboard = str => navigator.clipboard.writeText(str)
									.then(() => console.log("Text copied to clipboard!"))
									.catch(err => console.error("Error copying text to clipboard:", err));

	getValue(input) {
		input = globalThis.isstr(input) ? this.elements[input] : input;
		return input.getValue();
	}
	setValue(input, value) {
		input = globalThis.isstr(input) ? this.elements[input] : input;
		input.setValue(value);
		return this;
	}

	setDisabled(input, force) { // accept input name or element
		input = globalThis.isstr(input) ? this.elements[input] : input;
		input.setDisabled(force);
		return this;
	}
	setReadonly(input, force) {
		input = globalThis.isstr(input) ? this.elements[input] : input;
		input.setReadonly(force);
		return this;
	}
	setEditable(input, force) {
		input = globalThis.isstr(input) ? this.elements[input] : input;
		input.setEditable(force);
		return this;
	}

	setOk(input) { // accept input name or element
		input = globalThis.isstr(input) ? this.elements[input] : input;
		const tipEl = input.parentNode.querySelector("." + this.dataset.tipErrorClass);
		if (tipEl) // is optional, not all inputs have tip element
			tipEl.innerText = ""; // clear tip message
		input.classList.remove(this.dataset.errorClass);
		return this;
	}
	closeAlerts() {
		alerts.close(); // global message
		this.elements.forEach(el => el.classList.remove(this.dataset.errorClass)); // clear input messages
		this.querySelectorAll("." + this.dataset.tipErrorClass).forEach(el => el.innerText = ""); // clear tip messages
		return this;
	}
	setError(input, tip, msg) { // accept input name or element
		input = globalThis.isstr(input) ? this.elements[input] : input;
		const tipEl = input.parentNode.querySelector("." + this.dataset.tipErrorClass);
		if (tipEl) // is optional, not all inputs have tip element
			tipEl.innerText = i18n.msg(tip);
		input.classList.add(this.dataset.errorClass);
		alerts.setError(msg); // global message
		input.focus(); // set focus on error
		return this;
	}
	setRequired = (input, msg) => this.setError(input, "errRequired", msg);
	setFormatError = (input, msg) => this.setError(input, "errFormat", msg);

	#matches(el, selector) { // private method to check if element matches selector and is not a default-element
		return !el.classList.contains("default-element") && (!selector || el.matches(selector));
	}
	update(data, editable, selector) {
		this.elements.forEach(el => {
			if (this.#matches(el, selector)) {
				el.setValue(data[el.name]); // load value
				el.setEditable(editable); // recalc. if editable
				this.setOk(el); // reset input state
			}
		});
		observer.emit(this.dataset.loadedClass, data);
		return this.setChanged(false);
	}
	#load(data, editable, selector) {
		this.#data = data; // store data cache
		return this.update(data, editable, selector);
	}
	create(data) { return this.#load(data, true); }
	load(data, editable, selector) { return this.#load(data, editable, selector); }

	validate(selector) {
		let ok = !!alerts.close(); // reset global message
		for (let i = this.elements.length - 1; i >= 0; i--) {
			const el = this.elements[i]; // current input
			ok = this.#matches(el, selector) ? (el.validate() && ok) : ok; // validate only selected inputs
		}
		if (!ok && !alerts.isError()) // global message?
			alerts.setError(this.dataset.msgError); 
		return ok; // return valid indicator
	}

	getUrlParams = () => new URLSearchParams(new FormData(this));
	getFormData(selector) {
		const fd = new FormData();
		this.elements.forEach(el => {
			if (this.#matches(el, selector))
				el.toFormData(fd); // only selected inputs
		});
		return fd;
	}
	getData(selector) {
		const data = {}; // results container
		this.elements.forEach(el => {
			if (this.#matches(el, selector))
				el.toData(data); // only selected inputs
		});
		return data;
	}

	addListener(input, name, fn) {
		input = globalThis.isstr(input) ? this.elements[input] : input;
		input.addListener(name, fn);
		return this;
	}
	addChange(input, fn) {
		input = globalThis.isstr(input) ? this.elements[input] : input;
		input.addChange(fn);
		return this;
	}

	connectedCallback() {
		this.dataset.msgOk = this.dataset.msgOk || "saveOk";
		this.dataset.msgError = this.dataset.msgError || "errForm"; // default key messages
		this.dataset.errorClass = this.dataset.errorClass || "ui-error";
		this.dataset.tipErrorClass = this.dataset.tipErrorClass || "ui-errtip";
		this.dataset.negativeClass = this.dataset.negativeClass || "text-red"; // default css class input
		this.dataset.loadedClass = this.dataset.loadedClass || "form-loaded"; // reload class selector

		this.setAttribute("novalidate", "1");
		this.addEventListener("reset", () => alerts.close());
		this.addEventListener("change", () => this.setChanged(true));
	}
}

customElements.define("data-list", DataList, { extends: "select" });
customElements.define("text-input", TextInput, { extends: "input" });
customElements.define("date-input", DateInput, { extends: "input" });
customElements.define("float-input", FloatInput, { extends: "input" });
customElements.define("email-input", EmailInput, { extends: "input" });
customElements.define("file-input", FileInput, { extends: "input" });
customElements.define("text-area", TextArea, { extends: "textarea" });
customElements.define("check-input", CheckInput, { extends: "input" });
customElements.define("btn-form", ButtonForm, { extends: "button" });
