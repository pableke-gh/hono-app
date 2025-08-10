
import i18n from "../../i18n/langs.js";

export default function(container, opts) {
	opts = opts || {}; // Init. options
    opts.name = opts.name || "ms_test";
    opts.activeClassName = opts.activeClassName || "active";
    opts.checkedClassName = opts.checkedClassName || "checked";

    opts.msgEmptyOption = opts.msgEmptyOption || "Select options...";
    opts.emptyOption = opts.emptyOption || `<span>${i18n.get(opts.msgEmptyOption)}</span>`;

    opts.dropdownIcon = opts.dropdownIcon || '<i class="fas fa-chevron-down icon"></i>';
    opts.checkedIcon = opts.checkedIcon || '<i class="far fa-square icon"></i>';
    opts.uncheckedIcon = opts.uncheckedIcon || '<i class="far fa-check-square icon"></i>';

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
        button.querySelectorAll("[data-index]").setClick((ev, icon) => { // selected event
			delete _data[+icon.dataset.index].checked;
			fnRenderItems();
			fnEvent(ev);
		});

		options.innerHTML = _data.map(fnRenderOptions).join(""); // Render items
        options.children.forEach((li, i) => { // selected event
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
    this.getChecked = () => _data.filter(item => item.checked);
    this.getSelected = self.getChecked; // sinonym for getChecked
    this.size = () => (_data ? self.getChecked().length : 0); // get number of checked items
    this.isEmpty = () => (self.size() === 0); // check if no items selected
    this.getValues = () => self.getChecked().map(item => item.value); // get values from checked items
	this.setValues = values => { // set values from array
		_data.forEach(item => { item.checked = values.includes(item.value); }); // set checked
		return fnRenderItems(); // render field
	}

	this.reset = () => {
		_data = []; // clear items
		button.innerHTML = opts.emptyOption + opts.dropdownIcon; // Empty text = first option
		options.innerHTML = `<li>${i18n.get(opts.msgEmptyOption)}</li>`; // Empty text = first option
		opts.onReset(self); // Fire reset event
		return self;
	}
	this.clear = () => { // build items from options
		_data.forEach(item => { delete item.checked; }); // set unchecked
		return fnRenderItems(); // render field
	}
	this.build = () => { // build items from options
		_data = options.querySelectorAll("input").map(el => ({ value: el.value, label: el.textContent }));
		return fnRenderItems(); // render field
	}
	this.setItems = (items, values) => {
		if (!JSON.size(items))
			return self.reset();
		_data = items; // set items
		return values ? self.setValues(values) : fnRenderItems();
	}
	this.setLabels = (labels, values) => {
		if (!JSON.size(labels))
			return self.reset();
		const fnDefault = label => ({ value: label, label });
		const fnValues = label => ({ value: label, label, checked: values.includes(label) });
		_data = labels.map(values ? fnValues : fnDefault); // build items
		return fnRenderItems(); // render field
	}

	// Events and handlers
	label.onclick = ev => { button.focus(); fnEvent(ev); } // set focus on label click
	document.onclick = () => { options.classList.remove(opts.activeClassName); } // close dropdown on click outside
	button.onclick = ev => { options.classList.toggle(opts.activeClassName); fnEvent(ev); } // toggle dropdown
}
