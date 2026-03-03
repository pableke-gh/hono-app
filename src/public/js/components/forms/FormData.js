
export default class FormDataBox extends FormData {
	set(name, value) { value && super.set(name, value); return this; }
	append(name, value) { value && super.append(name, value); return this; }

	setFile(el) {
		const size = el.files.length;
		for (let i = 0; i < size; i++) {
			const file = el.files[i]; // file at i
			super.append(el.name, file, file.name);
		}
		return this;
	}

	setInput = el => ((el.type == "file") ? this.setFile(el) : this.append(el.name, el.getValue()));
	setInputs(elements) { elements.forEach(el => this.setInput(el)); return this; }
	setJSON(name, data) { // FormData only supports flat values
		super.set(name, JSON.stringify(data));
		return this;
	}

	exclude(keys) {
		keys.forEach(key => super.delete(key)); // delete selected keys
		return this;
	}
	load(data, keys) {
		keys.forEach(key => { this.set(key, data[key]); }); // set slected keys
		return this;
	}
}
