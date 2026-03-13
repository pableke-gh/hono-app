
import sb from "../types/StringBox.js";
import input from "./FormInput.js";

// Register the custom element
//customElements.define("data-list", DataList, { extends: "select" });
//Use in HTML: <select name="mySelect" is="data-list" class="ui-input ..." />   
export default class DataList extends HTMLSelectElement {
	#data;

	constructor() {
		super(); // Must call super before 'this'
		// Initialize the element
		this.classList.add("ui-input", "ui-select");
	}

	getData = () => this.#data;
	setData(data) { this.#data = data; return this; }
	getCurrent = () => this.#data[this.selectedIndex];
	getItem = index => this.#data[index];
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

	setEmptyOption(text) { this.dataset.emptyOption = text; return this; }
	// IMPORTANT! force value = "", to avoid change event return text content
	#empty = () => (this.dataset.emptyOption ? `<option value="">${this.dataset.emptyOption}</option>` : "");
	#change() { this.dispatchEvent(new Event("change")); return this; }

	getValue = () => this.value;
	setValue(value) {
		this.value = value; // force select an option
		this.selectedIndex = Math.max(0, this.selectedIndex);
		return this;
	}
	load(data) { data[this.name] = this.getValue(); }

	addListener(name, fn) { this.addEventListener(name, fn); return this; }
	addChange(fn) { return this.addListener("change", fn); }

	reset = () => { this.selectedIndex = 0; return this.#change(); } // same options
	clear = () => { this.#data = null; this.innerHTML = this.#empty(); return this.reset(); } // remove data and first option
	restart() { this.focus(); return this.reset(); } // focus and first option

	setItems = (items, isOptional) => {
		if (!items) return this.clear(); // vacio el desplegable
		const fnItem = item => `<option value="${item.value}">${item.label}</option>`; // Item list
		this.innerHTML = (isOptional ? this.#empty() : "") + items.map(fnItem).join(""); // Render items
		return this.setData(items).#change(); // set data and fire change event
	}
	setObject = (data, isOptional) => {
		if (!data) return this.clear(); // vacio el desplegable
		this.innerHTML = isOptional ? this.#empty() : "";
		for (const k in data) // Iterate over all keys
			this.innerHTML += `<option value="${k}">${data[k]}</option>`;
		return this.setData(data).#change(); // set data and fire change event
	}
	setLabels = (labels, isOptional) => {
		if (!labels) return this.clear(); // vacio el desplegable
		const fnLabel = label => `<option value="${label}">${label}</option>`; // label list
		this.innerHTML = (isOptional ? this.#empty() : "") + labels.map(fnLabel).join(""); // Render labels
		return this.setData(labels).#change(); // set data and fire change event
	}
	setValues(values, labels, isOptional) {
		if (!values) return this.clear(); // vacio el desplegable
		const fnBuild = (value, i) => `<option value="${value}">${labels[i]}</option>`; // label list
        this.innerHTML = (isOptional ? this.#empty() : "") + values.map(fnBuild).join(""); // Render labels
		return this.setData(values).#change(); // set data and fire change event
	}

	setDisabled(force) { input.setDisabled(this, force); return this; }
	setReadonly(force) { input.setReadonly(this, force); return this; }
	setEditable = force => this.setReadonly(!force);

	setOk = () => input.setOk(this);
	setError = tip => input.setError(this, tip);
	update = tip => input.update(this, tip);
}
