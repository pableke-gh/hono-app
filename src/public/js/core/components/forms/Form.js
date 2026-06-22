
import alerts from "../Alerts.js";
import observer from "../../util/Observer.js";

import DataList from "./DataList.js";
import TextInput from "./TextInput.js";
import FloatInput from "./FloatInput.js";
import FileInput from "./FileInput.js";
import TextArea from "./TextArea.js";
import ButtonForm from "./ButtonForm.js";

export default class FormHTML extends HTMLFormElement {
	#isChanged; #data;

	isChanged = () => this.#isChanged;
	setChanged(val) { this.#isChanged = val; return this; }
	isCached = id => (id == this.#data.id);

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
		input.next("." + this.dataset.tipErrorClass)?.setText("");
		input.classList.remove(this.dataset.errorClass);
		return this;
	}
	setError(input, tip, msg) { // accept input name or element
		input = globalThis.isstr(input) ? this.elements[input] : input;
		input.next("." + this.dataset.tipErrorClass)?.setMsg(tip);
		input.classList.add(this.dataset.errorClass);
		alerts.setError(msg); // global message
		input.focus(); // set focus on error
		return this;
	}
	setRequired = (input, msg) => this.setError(input, "errRequired", msg);
	setFormatError = (input, msg) => this.setError(input, "errFormat", msg);

	load(data, editable, selector) {
		this.elements.forEach(el => {
			if (!this.#matches(el, selector))
				return; // skip not selected inputs
			el.setValue(data[el.name]); // load value
			el.setEditable(editable); // recalc. if editable
			this.setOk(el); // reset input state
		});
		this.#data = data; // store data
		observer.emit("form-updated", data);
		return this.setChanged(false);
	}
	create(data) {
		return this.load(data, true);
	}

	#matches = (el, selector) => (!selector || el.matches(selector));
	validate(selector) {
		let ok = !!alerts.close(); // global message
		for (let i = this.elements.length - 1; i >= 0; i--) {
			const el = this.elements[i]; // current input
			ok = this.#matches(el, selector) ? (el.validate() && ok) : ok; // validate only selected inputs
		}
		return ok;
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

	connectedCallback() {
		this.dataset.msgOk = this.dataset.msgOk || "saveOk";
		this.dataset.msgError = this.dataset.msgError || "errForm"; // default key messages
		this.dataset.errorClass = this.dataset.errorClass || "ui-error";
		this.dataset.tipErrorClass = this.dataset.tipErrorClass || "ui-errtip";
		this.dataset.negativeClass = this.dataset.negativeClass || "text-red"; // default css class input

		this.setAttribute("novalidate", "1");
		this.addEventListener("reset", () => alerts.close());
		this.addEventListener("change", () => this.setChanged(true));
	}
}

customElements.define("data-list", DataList, { extends: "datalist" });
customElements.define("text-input", TextInput, { extends: "input" });
customElements.define("float-input", FloatInput, { extends: "input" });
customElements.define("file-input", FileInput, { extends: "input" });
customElements.define("text-area", TextArea, { extends: "textarea" });
customElements.define("btn-form", ButtonForm, { extends: "button" });
