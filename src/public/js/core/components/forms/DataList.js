
import alerts from "../../../core/components/alerts/Alerts.js";
import sb from "../../../components/types/StringBox.js";
import i18n from "../../i18n/langs.js";

// Register the custom element
//customElements.define("data-list", DataList, { extends: "select" });
//Use in HTML: <select name="mySelect" is="data-list" class="ui-input ..." />   
export default class DataList extends HTMLSelectElement {
	#data;

	constructor() { // Initialize the element HTML
		super(); // Must call super before 'this'
		this.classList.add("ui-input", "ui-select");
		this.setEmptyOption(this.dataset.empty || "selectOption");
	}

	setEmptyOption(msg) { this.dataset.empty = i18n.msg(msg); return this; }
	// IMPORTANT! force value = "", to avoid change event return text content
	#empty = () => `<option value="">${this.dataset.empty}</option>`;

	getData = () => this.#data;
	setData(data) { this.#data = data; return this; }
	getCurrent = () => (this.#data && this.#data[this.selectedIndex]);
	getItem = index => (this.#data && this.#data[index]);
	getIndex = () => this.selectedIndex;
	isEmpty = () => !this.#data;

	getOption = () => this.options[this.getIndex()]; // current option element
	getText = () => this.getOption()?.innerText; // current option text
	getCode = sep => sb.getCode(this.getText(), sep);
	select(mask) {
		const option = this.getOption(); //get current option
		this.options.mask(mask); // update all options class
		if (option && option.classList.contains("hide")) // contains hide class
			this.selectedIndex = this.options.findIndexBy(":not(.hide)");
		return this;
	}

	getValue = () => this.value;
	setIndex(index) { this.selectedIndex = Math.max(0, index); return this; }  // force select an option
	setValue(value) { this.value = value; return this.setIndex(this.selectedIndex); }
	getValues = () => Array.from(this.options).map(option => option.value);
	getLabels = () => Array.from(this.options).map(option => option.innerText);
	//getCodes = () => Array.from(this.options).map(option => sb.getCode(option.innerText));
	toData(data) { data[this.name] = this.getValue(); return this; }
	toFormData(fd) { fd.append(this.name, this.getValue()); return this; }

	addListener(name, fn) { this.addEventListener(name, fn); return this; }
	addChange(fn) { return this.addListener("change", fn); }

	hide() { this.parentNode.classList.add("hide"); }
	show() { this.parentNode.classList.remove("hide"); }
	setVisible(visible) { visible ? this.show() : this.hide(); }

	reset() { this.selectedIndex = 0; return this; } // force first option
	clear() { this.innerHTML = this.#empty(); return this.setData(null).reset(); } // remove data and set first option
	restart() { this.focus(); return this.reset(); } // set focus and force first option

	setOption(value, label) { // Only an option
		if (!value) return this.clear(); // vacio el desplegable
		this.innerHTML = `<option value="${value}">${label}</option>`; // Only an option
		this.value = value; // set selected value
		return this.setData(null); // data empty
	}
	setItems(items, isOptional) {
		if (!items) return this.clear(); // vacio el desplegable
		const fnItem = item => `<option value="${item.value}">${item.label}</option>`; // Item list
		this.innerHTML = (isOptional ? this.#empty() : "") + items.map(fnItem).join(""); // Render items
		return this.setData(items); // set data and fire change event
	}
	setObject(data, isOptional) {
		if (!data) return this.clear(); // vacio el desplegable
		this.innerHTML = isOptional ? this.#empty() : "";
		for (const k in data) // Iterate over all keys
			this.innerHTML += `<option value="${k}">${data[k]}</option>`;
		return this.setData(data); // set data and fire change event
	}
	toObject() {
		const data = {};
		this.options.array.forEach(opt => { data[opt.value] = opt.innerText; });
		return data;
	}
	setLabels(labels, isOptional) {
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
	setArray(labels, isOptional) { // start value = 1
		if (!labels) return this.clear(); // vacio el desplegable
		const fnBuild = (label, i) => `<option value="${i+1}">${label}</option>`; // label 1 index
        this.innerHTML = (isOptional ? this.#empty() : "") + labels.map(fnBuild).join(""); // Render labels
		return this.setData(labels); // set data and fire change event
	}

	setDisabled(force) { this.classList.toggle("disabled", this.toggleAttribute("disabled", force)); }
	setReadonly(force) { this.classList.toggle("readonly", this.toggleAttribute("readonly", force)); }
	setEditable(force) { this.form.isEditableManual(this) || this.setReadonly(!force); }

	// Validators
	#setTipError(tip) { // optional tag => not all inputs have tip element
		const tipEl = this.parentNode.querySelector("." + this.form.dataset.tipErrorClass);
		if (tipEl) tipEl.innerText = i18n.msg(tip);
	}
	setOk() {
		this.#setTipError(""); // set optional tip-msg
		this.classList.remove(this.form.dataset.errorClass);
	}
	setError(tip, msg) {
		this.#setTipError(tip); // set optional tip-msg
		this.classList.add(this.form.dataset.errorClass); // update styles
		alerts.setError(msg); // global message
		this.focus(); // set focus on error
	}
	setRequired(msg) { this.setError("errRequired", msg); }
	setFormatError(msg) { this.setError("errFormat", msg); }

	force(msg) { return (this.value ? !this.setOk() : this.setRequired(msg)); } // force required validation
	validate() { return (this.required ? this.force() : !this.setOk()); } // optional o required with value
}
