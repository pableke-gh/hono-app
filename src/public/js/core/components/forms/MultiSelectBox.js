
import i18n from "../../i18n/langs.js";
import ButtonForm from "./ButtonForm.js";

export default class MultiSelectBox extends ButtonForm {
	#data; // data container

	getData = () => this.#data;
	setData(data) { this.#data = data; return this; };

	size = () => (this.#data ? this.#data.length : 0);
	isEmpty = () => (this.size() == 0); // no data loaded
	isLoaded = () => (this.#data && this.#data.some(item => item.checked));
	getChecked() { return (this.#data ? this.#data.filter(item => item.checked) : []); } // filter checked items
	getValues() { return this.getChecked().map(item => item.value); } // selected values
	toData(data) { data[this.name] = this.getValues(); }

	#stopPropagation(ev) { // avoid to fire document onclick event
		ev.stopPropagation();
		ev.preventDefault();
	}
	#selected(item) { // selected item span
		const span = document.createElement("span");
		span.innerHTML = item.label + '<i class="fas fa-times"></i>';
		span.lastElementChild.onclick = ev => {
			this.#stopPropagation(ev);
			delete item.checked;
			this.render();
		}
		return span;
	}
	#option(item) { // create option li
		const li = document.createElement("li");
		const icon = item.checked ? this.dataset.checkedIcon : this.dataset.uncheckedIcon;
		li.innerHTML = icon + item.label;
		li.onclick = ev => {
			item.checked = !item.checked;
			this.#stopPropagation(ev);
			this.render();
		}
		return li;
	}

	render() {
		const ul = this.nextElementSibling; // ul element
		ul.replaceChildren(); // removes all li children
		this.innerText = ""; // clear selected items
		this.#data.forEach(item => { // render options
			if (item.checked) // selected item
				this.appendChild(this.#selected(item));
			ul.appendChild(this.#option(item)); // render option
		});

		if (!this.innerHTML) // if no selected items
			this.innerHTML = i18n.get(this.dataset.msgEmptyOption);
		this.insertAdjacentHTML("beforeend", this.dataset.dropdownIcon);
		this.form.setChanged(true); // update change indicator
	}

	setLabels(labels) { // build items array from label array
		return this.setData(labels.map(label => ({ value: label, label })));
	}

	setValue(value) {
		this.#data.forEach(item => { item.checked = (item.value == value); });
		return this;
	}
	setValues(values) { // intersection between data and values
		this.#data.forEach(item => { item.checked = values.includes(item.value); });
		return this;
	}
	setIndex(index) {
		this.#data.forEach((item, i) => { item.checked = (i == index); });
		return this;
	}
	setFirst() {
		return this.setIndex(0);
	}

	reset() { // remove selected items
		this.#data.forEach(item => { delete item.checked; });
		this.render();
	}
	clear() {
		this.#data = null; // remove all items
		this.nextElementSibling.replaceChildren(); // removes all li children
		this.innerHTML = i18n.get(this.dataset.msgEmptyOption) + this.dataset.dropdownIcon;
	}

	execute(ev) { // execute action on selected items
		this.nextElementSibling.classList.toggle(this.dataset.activeClassName); // toggle ul dropdown
		this.#stopPropagation(ev); // avoid to fire document onclick event
	}

	connectedCallback() {
		super.connectedCallback(); // init. component
		this.dataset.activeClassName = this.dataset.activeClassName || "active";
		this.dataset.msgEmptyOption = this.dataset.msgEmptyOption || "selectOptions";
		this.dataset.dropdownIcon = this.dataset.dropdownIcon || '<i class="fas fa-chevron-down"></i>';
		this.dataset.checkedIcon = this.dataset.checkedIcon || '<i class="far fa-check-square icon"></i>';
		this.dataset.uncheckedIcon = this.dataset.uncheckedIcon || '<i class="far fa-square icon"></i>';
		this.dataset.inputErrorClass = this.dataset.inputErrorClass || "ui-error"; // Input error styles

		this.type = "button"; // no action by default
		this.classList.remove("btn"); // remove buton styles
		this.classList.add("ui-input"); // same style than input elements
		this.clear(); // clear data and render empty state

		this.nextElementSibling.onclick = ev => {
			this.#stopPropagation(ev); // avoid to close ul dropdown on click inside
		}
		document.onclick = () => { // close dropdown on click outside
			this.nextElementSibling.classList.remove(this.dataset.activeClassName);
		}
	}
}
