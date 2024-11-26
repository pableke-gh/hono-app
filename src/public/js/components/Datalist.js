
import sb from "./StringBox.js";

const EMPTY = [];
const fnParam = param => param

export default function(select, opts) {
    opts = opts || {}; // Init. options
    opts.onChange = opts.onChange || fnParam; // fired on change select
    opts.onReset = opts.onReset || fnParam; // fired on reset select

    const self = this; //self instance
    let _data = EMPTY; // default = empty array

    const fnInit = (data, emptyOption) => { // init. datalist
        select.innerHTML = emptyOption ? `<option>${emptyOption}</option>` : ""; // Empty text = first option
        _data = data;
    }
    const fnChange = data => {
        opts.onChange(data, self); // call change event
        return self;
    }

    this.getItems = () => _data;
    this.getItem = index => _data[index];
    this.getIndex = () => select.selectedIndex;
	this.isOptional = () => !select.options[0]?.value;
    this.getCurrentItem = () => _data[select.selectedIndex];

    this.getSelect = () => select; // get select element
    this.getOption = () => select.options[self.getIndex()]; // current option element
	this.getText = () => self.getOption()?.innerHTML; // current option text
	this.getCode = sep => sb.getCode(self.getText(), sep);
	this.getValue = () => select.value; // current value
	this.setValue = value => {
        select.value = value;
        return fnChange(value);
    }

    this.reset = () => {
        fnInit(EMPTY, opts.emptyOption); // Init. datalist
        opts.onReset(self); // Fire reset event
        return self;
    }

    this.setItems = function(items) {
        if (!JSON.size(items))
            return self.reset();
        fnInit(items); // Init. datalist
        const fnItem = item => `<option value="${item.value}">${item.label}</option>`; // Item list
        select.innerHTML += _data.map(fnItem).join(""); // Render items
        return fnChange(_data[0]);
	}
	this.setOptions = function(labels, values) {
        if (!JSON.size(labels))
            return self.reset();
        fnInit([]); // Init. datalist
        const fnDefault = i => i;
        const fnValue = i => values[i];
        const fn = values ? fnValue : fnDefault;
        labels.forEach((label, i) => { // keys = 0, 1, 2... Number array
            select.innerHTML += `<option value="${fn(i)}">${label}</option>`;
            _data.push(fn(i)); // add value
        });
        return fnChange(_data[0]);
	}
    this.setData = function(data) {
        if (!data)
            return self.reset();
        fnInit([]); // Init. datalist
        for (const k in data) { // Iterate over all keys
            select.innerHTML += `<option value="${k}">${data[k]}</option>`;
            _data.push(k); // add value
        }
        return fnChange(_data[0]);
    }
	this.setLabels = function(labels) {
        if (!JSON.size(labels))
            return self.reset();
        fnInit([]); // Init. datalist
        labels.forEach(label => {
            select.innerHTML += `<option value="${label}">${label}</option>`;
        });
        _data = labels; // set values
        return fnChange(_data[0]);
	}
	this.setRange = function(min, max, step, fnLabel) {
        step = step || 1; // default step = 1
        fnLabel = fnLabel || fnParam; // defautl label
        fnInit([]); // Init. datalist
        for (let i = min; i <= max; i += step) {
            select.innerHTML += `<option value="${i}">${fnLabel(i)}</option>`;
            _data.push(i); // add value
        }
        return fnChange(_data[0]);
	}

	this.toggleOptions = function(flags) {
		const option = self.getOption(); //get current option
		select.options.mask(flags); // toggle hide class
		if (option && option.isHidden()) // is current option hidden?
			select.selectedIndex = select.options.findIndex(el => !el.isHidden());
		return self;
	}

    select.addEventListener("change", ev => {
        fnChange(self.getCurrentItem());
    });
}
