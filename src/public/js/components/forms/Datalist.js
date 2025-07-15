
import sb from "../types/StringBox.js";
import dom from "./DomBox.js";

const EMPTY = [];
const fnParam = param => param

export default function(select, opts) {
    opts = opts || {}; // Init. options
    opts.onChange = opts.onChange || fnParam; // fired on change select
    opts.onReset = opts.onReset || fnParam; // fired on reset select

    const self = this; //self instance
    let _data = EMPTY; // default = empty array

	const fnEmpty = () => (opts.emptyOption ? `<option>${opts.emptyOption}</option>` : "");
	const fnChange = data => { opts.onChange(data, self); return self; }

	this.set = (name, fn) => { opts[name] = fn; return self; }
	this.setEmptyOption = text => self.set("emptyOption", text);
	this.setChange = fn => self.set("onChange", fn);
	this.setReset = fn => self.set("onReset", fn);

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
        _data = EMPTY;
        select.innerHTML = fnEmpty(); // Empty text = first option
        opts.onReset(self); // Fire reset event
        return self;
    }

    this.setItems = items => {
        if (!JSON.size(items))
            return self.reset();
        _data = items; // Init. datalist
        dom.setItems(select, items);
        return fnChange(_data[0]);
	}
    this.setData = data => {
        if (!data)
            return self.reset();
		_data = Object.keys(data); // Init. datalist
		dom.setData(select, data); // set options
        return fnChange(_data[0]);
    }
	this.setLabels = labels => {
        if (!JSON.size(labels))
            return self.reset();
		_data = labels; // set values
		dom.setLabels(select, labels);
        return fnChange(_data[0]);
	}
	this.setRange = function(min, max, step, fnLabel) {
		step = step || 1; // default step = 1
		fnLabel = fnLabel || fnParam; // defautl label
		_data = []; // init datalist
		select.innerHTML = fnEmpty();
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
