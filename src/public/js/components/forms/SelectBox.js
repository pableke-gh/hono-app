
function SelectBox() {
	const self = this; //self instance

	this.isSelect = el => (el && el.options);
	this.getOption = select => (select && select.options[select.selectedIndex]); // get current option element
	this.getOptionText = select => self.getOption(select)?.innerHTML; // get current option text
	this.getOptionByValue = (select, value) => (select && select.options.find(option => (option.value == value))); // get option by value
	this.getOptionTextByValue = (select, value) => self.getOptionByValue(select, value)?.innerHTML; // get option text by value
	this.select = function(el, mask) {
		if (self.isSelect(el)) {
			const option = self.getOption(el); //get current option
			el.options.mask(mask); // update all options class
			if (option && option.isHidden()) // contains hide class
				el.selectedIndex = el.options.findIndexBy(":not(.hide)");
		}
		return self;
	}

	const fnEmpty = emptyOption => (emptyOption ? `<option>${emptyOption}</option>` : ""); 
	this.setItems = (select, items, emptyOption) => {
		const fnItem = item => `<option value="${item.value}">${item.label}</option>`; // Item list
        select.innerHTML = fnEmpty(emptyOption) + items.map(fnItem).join(""); // Render items
		return self;
	}
    this.setData = (select, data, emptyOption) => {
		select.innerHTML = fnEmpty(emptyOption);
        for (const k in data) // Iterate over all keys
            select.innerHTML += `<option value="${k}">${data[k]}</option>`;
		return self;
    }
	this.setLabels = (select, labels, emptyOption) => {
		const fnLabel = label => `<option value="${label}">${label}</option>`; // label list
        select.innerHTML = fnEmpty(emptyOption) + labels.map(fnLabel).join(""); // Render labels
		return self;
	}
}

export default new SelectBox();
