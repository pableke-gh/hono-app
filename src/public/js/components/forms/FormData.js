
export default class FormDataBox extends FormData {
	set(name, value) { value && super.set(name, value); return this; }
	add(name, value) { value && super.append(name, value); return this; }

	setInput = el => this.set(el.name, el.getValue());
	setInputs(elements) { elements.forEach(this.setInput); return this; }

	addInput = el => { el.addFormData(this); return this; }
	addInputs(elements) { elements.forEach(this.addInput); return this; }

	setJSON(name, data) { // FormData only supports flat values
		super.set(name, JSON.stringify(data));
		return this;
	}

	load(data, keys) {
		keys.forEach(key => this.set(key, data[key])); // set slected keys
		return this;
	}
	exclude(keys) {
		keys.forEach(key => super.delete(key)); // delete selected keys
		return this;
	}
}
