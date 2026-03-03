
import sb from "../types/StringBox.js";

// Register the custom element
//customElements.define("data-list", DataList, { extends: "select" });
//Use in HTML: <select name="mySelect" is="data-list" class="ui-input ..." />   
export default class DataList extends HTMLSelectElement {
	#data;

	constructor() {
		super(); // Must call super before 'this'
		this.dataset.errorClass = this.dataset.errorClass || "ui-error"; // Input error styles
		this.dataset.tipErrorClass = this.dataset.tipErrorClass || "ui-errtip"; // Tip error style

		// Initialize the element
		this.classList.add("ui-input", "ui-select");
	}

	getData = () => this.#data;
	setData(data) { this.#data = data; return this; }
	getCurrent = () => this.#data[this.selectedIndex];
	getItem = index => this.#data[index];
	getIndex = () => this.selectedIndex;

	//isOptional = () => !this.options[0]?.value;
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
	#empty = () => (this.dataset.emptyOption ? `<option>${this.dataset.emptyOption}</option>` : "");
	#change() { this.dispatchEvent(new Event("reset")); return this; }

	getValue = () => this.value;
	setValue(value) {
		if (!value)
			this.selectedIndex = 0; // first option
		else
			this.value = value;
		return this;
	}
	load(data) { data[this.name] = this.getValue(); }

	addReset(fn) { this.addEventListener("reset", fn); return this; }
	addChange(fn) { this.addEventListener("change", fn); return this; }
	reset = () => { // Empty text = first option
		this.value = "";
		this.#data = null;
		this.innerHTML = this.#empty();
		return this.#change();
	}
	restart() { this.focus(); return this.reset(); }

	setItems = (items, isOptional) => {
		if (!items)
			return this.reset();
		const fnItem = item => `<option value="${item.value}">${item.label}</option>`; // Item list
		this.innerHTML = (isOptional ? this.#empty() : "") + items.map(fnItem).join(""); // Render items
		return this.setData(items).#change(); // set data and fire change event
	}
	setObject = (data, isOptional) => {
		if (!data)
			return this.reset();
		this.innerHTML = isOptional ? this.#empty() : "";
		for (const k in data) // Iterate over all keys
			this.innerHTML += `<option value="${k}">${data[k]}</option>`;
		return this.setData(data).#change(); // set data and fire change event
	}
	setLabels(labels, isOptional) {
		if (!labels)
			return this.reset();
		const fnLabel = label => `<option value="${label}">${label}</option>`; // label list
		this.innerHTML = (isOptional ? this.#empty() : "") + labels.map(fnLabel).join(""); // Render labels
		return this.setData(labels).#change(); // set data and fire change event
	}
	setValues(values, labels, isOptional) {
		const fnBuild = (value, i) => `<option value="${value}">${labels[i]}</option>`; // label list
        this.innerHTML = (isOptional ? this.#empty() : "") + values.map(fnBuild).join(""); // Render labels
		return this.setData(values).#change(); // set data and fire change event
	}

	setDisabled(force) { this.classList.toggle("disabled", this.toggleAttribute("disabled", force)); return this; }
	setReadonly = force => this.setDisabled(force); // The attribute readonly is not supported or relevant to <select>
	setEditable = force => this.setReadonly(!force);

	setOk() {
		this.next("." + this.dataset.tipErrorClass)?.setText("");
		this.classList.remove(this.dataset.errorClass);
		return this;
	}
	setError(tip) {
		this.next("." + this.dataset.tipErrorClass)?.setMsg(tip);
		this.classList.add(this.dataset.errorClass);
		this.focus(); // set focus on error
		return this;
	}
	update(tip) { // tip message is optional
		return tip ? this.setError(tip) : this.setOk();
	}
}
