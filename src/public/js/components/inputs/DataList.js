
import sb from "../types/StringBox.js";
import i18n from "../../i18n/langs.js";
import input from "./FormInput.js";

// Register the custom element
//customElements.define("data-list", DataList, { extends: "select" });
//Use in HTML: <select name="mySelect" is="data-list" class="ui-input ..." />   
export default class DataList extends HTMLSelectElement {
	#data;

	constructor() {
		super(); // Must call super before 'this'
		// Initialize the element HTML
		this.classList.add("ui-input", "ui-select");
		this.setEmptyOption(this.dataset.empty || "selectOption");
	}

	getData = () => this.#data;
	setData(data) { this.#data = data; return this; }
	getCurrent = () => (this.#data && this.#data[this.selectedIndex]);
	getItem = index => (this.#data && this.#data[index]);
	getIndex = () => this.selectedIndex;
	isEmpty = () => !this.#data;

	getOption = () => this.options[this.getIndex()]; // current option element
	getText = () => this.getOption()?.innerHTML; // current option text
	getCode = sep => sb.getCode(this.getText(), sep);
	select(mask) {
		const option = this.getOption(); //get current option
		this.options.mask(mask); // update all options class
		if (option && option.classList.contains("hide")) // contains hide class
			this.selectedIndex = this.options.findIndexBy(":not(.hide)");
		return this;
	}

	setEmptyOption(msg) { this.dataset.empty = i18n.msg(msg); return this; }
	// IMPORTANT! force value = "", to avoid change event return text content
	#empty = () => `<option value="">${this.dataset.empty}</option>`;

	getValue = () => this.value;
	setValue(value) {
		this.value = value; // force select an option
		this.selectedIndex = Math.max(0, this.selectedIndex);
		return this;
	}
	load(data) { return this.setValue(data[this.name]); }
	toData(data) { data[this.name] = this.getValue(); return this; }
	addFormData(fd) { fd.append(this.name, this.getValue()); return this; }

	addListener(name, fn) { this.addEventListener(name, fn); return this; }
	addChange(fn) { return this.addListener("change", fn); }

	reset() { this.selectedIndex = 0; return this; } // force first option
	clear() { this.innerHTML = this.#empty(); return this.setData(null).reset(); } // remove data and set first option
	restart() { this.focus(); return this.reset(); } // set focus and force first option

	setOption(value, label) { // Only an option
		if (!value) return this.clear(); // vacio el desplegable
		this.innerHTML = `<option value="${value}">${label}</option>`; // Only an option
		this.value = value; // set selected value
		return this.setData(null); // data empty
	}
	setItems = (items, isOptional) => {
		if (!items) return this.clear(); // vacio el desplegable
		const fnItem = item => `<option value="${item.value}">${item.label}</option>`; // Item list
		this.innerHTML = (isOptional ? this.#empty() : "") + items.map(fnItem).join(""); // Render items
		return this.setData(items); // set data and fire change event
	}
	setObject = (data, isOptional) => {
		if (!data) return this.clear(); // vacio el desplegable
		this.innerHTML = isOptional ? this.#empty() : "";
		for (const k in data) // Iterate over all keys
			this.innerHTML += `<option value="${k}">${data[k]}</option>`;
		return this.setData(data); // set data and fire change event
	}
	setLabels = (labels, isOptional) => {
		if (!labels) return this.clear(); // vacio el desplegable
		const fnLabel = label => `<option value="${label}">${label}</option>`; // label list
		this.innerHTML = (isOptional ? this.#empty() : "") + labels.map(fnLabel).join(""); // Render labels
		return this.setData(labels); // set data and fire change event
	}
	setValues(values, labels, isOptional) {
		if (!values) return this.clear(); // vacio el desplegable
		const fnBuild = (value, i) => `<option value="${value}">${labels[i]}</option>`; // label list
        this.innerHTML = (isOptional ? this.#empty() : "") + values.map(fnBuild).join(""); // Render labels
		return this.setData(values); // set data and fire change event
	}
	setIndexed(labels, isOptional) { // start value = 1
		if (!labels) return this.clear(); // vacio el desplegable
		const fnBuild = (label, i) => `<option value="${i+1}">${label}</option>`; // label 1 index
        this.innerHTML = (isOptional ? this.#empty() : "") + labels.map(fnBuild).join(""); // Render labels
		return this.setData(labels); // set data and fire change event
	}

	setDisabled(force) { return input.setDisabled(this, force); }
	setReadonly(force) { return input.setReadonly(this, force); }
	setEditable(model) { return input.setEditable(this, model); }
	prepare(model) { return input.prepare(this, model); }

	// Input Validators
	setOk() { return input.setOk(this); }
	setError(tip, msg) { return input.setError(this, tip, msg); }
	setRequired(msg) { return input.setRequired(this, msg); }
	setFormatError(msg) { return input.setFormatError(this, msg); }
	update(tip, msg) { return input.update(this, tip, msg); }
	validate() { return input.validate(this); }
}
