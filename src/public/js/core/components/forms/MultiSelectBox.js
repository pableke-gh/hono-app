
import i18n from "../../i18n/langs.js";

/**
 * Register the custom element: customElements.define("multi-list", MultiSelectBox, { extends: "ul" });
 */
export default class MultiSelectBox extends HTMLUListElement {
	#data; // data container

	getData = () => this.#data;
	setData(data) { this.#data = data; return this; };

	size = () => (this.#data ? this.#data.length : 0);
	isEmpty = () => (this.size() == 0); // no data loaded
	isLoaded = () => (this.#data && this.#data.some(item => item.checked));
	getChecked() { return (this.#data ? this.#data.filter(item => item.checked) : []); } // get checked items
	getSelected() { return this.getChecked(); } // sinonym for getChecked items

	#selected(item) {
		const span = document.createElement("span");
		span.className = this.dataset.checkedClassName;
		span.innerHTML = item.label + '<i class="fas fa-times"></i>';
		span.lastElementChild.onclick = ev => {
			delete item.checked;
			ev.preventDefault();
			this.render();
		}
		return span;
	}
	#option(item) {
		const name = this.getAttribute("name");
		const li = document.createElement("li");
		const params = item.checked ? 'checked class="hide"' : 'class="hide"';
		const icon = item.checked ? this.dataset.checkedIcon : this.dataset.uncheckedIcon;
		li.innerHTML = `<input type="checkbox" name="${name}" value="${item.value}" ${params}/>${icon}${item.label}`;
		li.onclick = ev => {
			item.checked = !item.checked;
			ev.preventDefault();
			this.render();
		}
		return li;
	}

	render() {
		for (let i = this.children.length - 1; i > 0; i--) // reverse remove
			this.removeChild(this.children[i]); // preserve first li button
		const button = this.firstElementChild.firstElementChild; // first li button
		button.innerText = this.isLoaded() ? "" : i18n.get(this.dataset.msgEmptyOption);
		this.#data.forEach(item => { // render options
			if (item.checked) // selected item
				button.appendChild(this.#selected(item));
			this.appendChild(this.#option(item)); // render option
		});
	}

	setLabels(labels) { // build items array from label array
		return this.setData(labels.map(label => ({ value: label, label })));
	}

	setValue(value) {
		this.#data.forEach(item => { item.checked = (item.value == value); });
		return this;
	}
	setValues(values) {
		// todo: implemnt intersection between data and values
	}
	setIndex(index) {
		this.#data.forEach((item, i) => { item.checked = (i == index); });
		return this;
	}
	setFirst() {
		return this.setIndex(0);
	}

	connectedCallback() {
		this.dataset.activeClassName = this.dataset.activeClassName || "active";
		this.dataset.checkedClassName = this.dataset.checkedClassName || "checked";
		this.dataset.msgEmptyOption = this.dataset.msgEmptyOption || "selectOptions";

		this.dataset.dropdownIcon = this.dataset.dropdownIcon || '<i class="fas fa-chevron-down"></i>';
		this.dataset.checkedIcon = this.dataset.checkedIcon || '<i class="far fa-check-square icon"></i>';
		this.dataset.uncheckedIcon = this.dataset.uncheckedIcon || '<i class="far fa-square icon"></i>';
		this.dataset.inputErrorClass = this.dataset.inputErrorClass || "ui-error"; // Input error styles

		const li = document.createElement("li");
		const button = document.createElement("button");
		button.type = "button"; // no action by default
		li.appendChild(button);
		this.appendChild(li);
		li.innerHTML += this.dataset.dropdownIcon;

		button.onclick = () => this.classList.toggle(this.dataset.activeClassName); // toggle dropdown
		//document.onclick = () => this.classList.remove(this.dataset.activeClassName); // close dropdown on click outside
	}

	/*	container = globalThis.isstr(container) ? $1(container) : container;
	container = container || document.createElement("div"); // create empty container

	opts = opts || {}; // Init. options
    opts.name = opts.name || "ms_test";
    opts.activeClassName = opts.activeClassName || "active";
    opts.checkedClassName = opts.checkedClassName || "checked";

    opts.msgEmptyOption = opts.msgEmptyOption || "selectOptions";
    opts.emptyOption = opts.emptyOption || `<span>${i18n.get(opts.msgEmptyOption)}</span>`;

    opts.dropdownIcon = opts.dropdownIcon || '<i class="fas fa-chevron-down"></i>';
    opts.checkedIcon = opts.checkedIcon || '<i class="far fa-square icon"></i>';
    opts.uncheckedIcon = opts.uncheckedIcon || '<i class="far fa-check-square icon"></i>';
	opts.inputErrorClass = opts.inputErrorClass || "ui-error"; // Input error styles

    opts.onChange = opts.onChange || globalThis.void; // fired on change list
    opts.onReset = opts.onReset || globalThis.void; // fired on reset list

    const self = this; //self instance
    const label = container.firstElementChild || document.createElement("div"); // first = label element
    const button = label.nextElementSibling || document.createElement("button"); // second = button dropdown
    const options = button.nextElementSibling || document.createElement("ul"); // third = selectable options
    let _data; // items container

	const fnEvent = ev => { ev.stopPropagation(); ev.preventDefault(); }
    const fnUnchecked = item => `<li><input type="checkbox" name="${opts.name}" value="${item.value}" class="hide"/>${opts.checkedIcon}${item.label}</li>`;
    const fnChecked = item => `<li><input type="checkbox" name="${opts.name}" value="${item.value}" checked class="hide"/>${opts.uncheckedIcon}${item.label}</li>`;
    const fnRenderOptions = item => item.checked ? fnChecked(item) : fnUnchecked(item);

    const fnItem = (item, i) => `<span class="${opts.checkedClassName}">${item.label}<i data-index="${i}" class="fas fa-times icon"></i></span>`;
    const fnSelected = (item, i) => item.checked ? fnItem(item, i) : "";
	const fnRenderItems = () => {
        button.innerHTML = (_data.map(fnSelected).join("") || opts.emptyOption) + opts.dropdownIcon;
        button.querySelectorAll("[data-index]").setClick((ev, icon) => { // selected items
			delete _data[+icon.dataset.index].checked;
			fnRenderItems();
			fnEvent(ev);
		});

		options.innerHTML = _data.map(fnRenderOptions).join(""); // Render items
    	options.children.forEach((li, i) => { // item check/uncheck event
			li.onclick = ev => {
				_data[i].checked = !_data[i].checked;
				fnRenderItems();
				fnEvent(ev);
			}
    	});

		opts.onChange(_data, self); // call change event
		return self;
	}

	// Handlers
	this.getData = () => _data;
	this.setData = data => { _data = data; return self; };
	this.setLabels = labels => self.setData(labels.map(label => ({ value: label, label }))); // build items array from label array

	const fnBuild = el => ({ value: el.value, label: el.textContent, checked: el.checked }); // build item from input element
	this.build = () => self.setData(options.querySelectorAll("input").map(fnBuild)); // build items from li > input[type=checkbox]

	this.size = () => (_data ? _data.length : 0); // get number of items
	this.getChecked = () => (_data ? _data.filter(item => item.checked) : []); // get checked items
	this.getSelected = self.getChecked; // sinonym for getChecked items
	this.getNumChecked = () => self.getChecked().length; // get number of checked items
	this.getNumSelected = self.getNumChecked; // sinonym for getNumChecked items
	this.isEmpty = () => (self.getNumChecked() === 0); // check if no items selected
	this.getValues = () => self.getChecked().map(item => item.value); // get values from checked items
	this.setValues = values => { // select values from array
		if (!values)
			return self.clear(); // uncheck all items
		_data.forEach(item => { item.checked = values.includes(item.value); }); // set checked
		return fnRenderItems(); // render field
	}
	this.setValue = value => { // select a single value
		_data.forEach(item => { item.checked = (item.value == value); }); // set checked
		return fnRenderItems(); // render field
	}

	this.reset = () => {
		_data = []; // remove items
		button.innerHTML = opts.emptyOption + opts.dropdownIcon; // Empty text = first option
		options.innerHTML = `<li>${i18n.get(opts.msgEmptyOption)}</li>`; // Empty text = first option
		opts.onReset(self); // Fire reset event
		return self;
	}
	this.clear = () => { // build items from options
		_data.forEach(item => { delete item.checked; }); // set unchecked
		return fnRenderItems(); // render field
	}

	this.setDefault = () => {
		button.classList.remove(opts.inputErrorClass); // remove error class
		options.nextElementSibling.innerHTML = ""; // remove error message
		return self;
	}
	this.setError = tip => {
		button.classList.add(opts.inputErrorClass); // add error class
		options.nextElementSibling.innerHTML = i18n.get(tip || "errRequired"); // set error message
		return self;
	}

	// Component events and handlers
	label.onclick = ev => { button.focus(); fnEvent(ev); } // set focus on label click
	document.onclick = () => { options.classList.remove(opts.activeClassName); } // close dropdown on click outside
	button.onclick = ev => { options.classList.toggle(opts.activeClassName); fnEvent(ev); } // toggle dropdown*/
}
