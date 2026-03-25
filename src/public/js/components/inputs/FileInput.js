
import TextInput from "./TextInput.js";

// Register the custom element
//customElements.define("file-input", FileInput, { extends: "input" });
//Use the custom element by adding the is attribute to a standard <input>:
//<input is="file-input" type="file" placeholder="Enter text" />   
export default class FileInput extends TextInput {
	constructor() {
		super(); // Must call super before 'this'

		// Initialize the element
		this.classList.add("hide");
	}

	setValue() { this.value = ""; return this; } // This input element accepts a filename no value (clear previously selected files)
	load() { this.value = ""; return this; } // This input element accepts a filename no value (clear previously selected files)
	toData(data) { data[this.name] = this.files; } // set all file list
	addFormData(fd) {
		const size = this.files.length;
		for (let i = 0; i < size; i++) {
			const file = this.files[i]; // file at i
			fd.append(this.name, file, file.name);
		}
		return this;
	}

	setReadonly(force) { return super.setDisabled(force); } // The attribute readonly is not supported or relevant to file input

	onFile(fn) {
		const reader = new FileReader();
		let file, index; // file, position

		const fnLoad = i => {
			file = this.files[i]; // multifile
			file && reader.readAsArrayBuffer(file); //reader.readAsText(file, "UTF-8");
		}
		reader.onload = ev => { // event on load file
			fn(ev, this, file, reader.result, index);
			fnLoad(++index);
		}

		this.addEventListener("change", () => {
			index = 0; // restart index
			fnLoad(index);
		});
	}
}
