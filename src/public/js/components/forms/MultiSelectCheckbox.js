
import i18n from "../../i18n/langs.js";

export default function(container, opts) {
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
    const label = container.firstElementChild; // first = label element
    const button = label.nextElementSibling; // second = button dropdown
    const options = button.nextElementSibling; // third = selectable options
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
	this.setError = (msg, msgtip) => {
		msgtip = msgtip || "errRequired"; // default error message
		button.classList.add(opts.inputErrorClass); // add error class
		options.nextElementSibling.innerHTML = i18n.get(msgtip); // set error message
		i18n.getValidators().addError(opts.name, msgtip, msg); // add error to validators
		return self;
	}

	// Component events and handlers
	label.onclick = ev => { button.focus(); fnEvent(ev); } // set focus on label click
	document.onclick = () => { options.classList.remove(opts.activeClassName); } // close dropdown on click outside
	button.onclick = ev => { options.classList.toggle(opts.activeClassName); fnEvent(ev); } // toggle dropdown
}
