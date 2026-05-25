
import TextInput from "./TextInput.js";

export default class CheckInput extends TextInput {

	getValue() { return this.checked ? this.value : null; }
	setValue(value) { this.checked = this.value == value; return this; } // not change value, only checked state
	load(data) { return this.setValue(data[this.name]); } // not change value, only checked state
	toData(data) {
		if (this.checked) { // add value only if checked
			data[this.name] = data[this.name] || [];
			data[this.name].push(this.value);
		}
		return this;
	}

	addFormData(fd) { fd.add(this.name, this.value); return this; }
	reset() { this.checked = false; return this; } // not change value, only checked state
	restart() { this.focus(); return this; } // only focus

}
