
import input from "./FormInput.js";
import TextInput from "./TextInput.js";
import observer from "../../core/util/Observer.js";

// Register the custom element
//customElements.define("file-input", FileInput, { extends: "input" });
//Use the custom element by adding the is attribute to a standard <input>:
//<input is="file-input" type="file" placeholder="Enter text" />   
export default class FileInput extends TextInput {
	connectedCallback() { // Initialize the element
		this.classList.add("hide"); // default hidden
		this.addChange(ev => observer.emit(this.name, ev.target));
		// propage event when form changes, clear filenames, etc.
		observer.subscribe("form-update", () => observer.emit(this.name, this));
	}

	// This input element accepts a filename no value (clear previously selected files)
	setValue() { this.value = ""; return this; } // clear selected files
	load() { return this.setValue(); }
	toData(data) { data[this.name] = this.files; } // set all file list
	isEmpty() { return (this.files.length == 0); } // is selected file
	isLoaded() { return (this.files.length > 0); } // is selected file
	addFormData(fd) {
		const size = this.files.length;
		for (let i = 0; i < size; i++) {
			const file = this.files[i]; // file at i
			fd.append(this.name, file, file.name);
		}
		return this;
	}

	setReadonly(force) { return super.setDisabled(force); } // The attribute readonly is not supported or relevant to file input
	setRequired(msg) { return input.setError(this, "errRequiredFile", msg); } // override
	validate() { return input.validate(this); }

	getFilename = () => (this.isLoaded() ? this.files[0].name : ""); // force a filename
	getFilenames(max) {
		if (this.isEmpty()) return ""; // no files selected
		const names = [...this.files].slice(0, max).map(file => file.name).join(", ");
		return names + ((this.files.length > max) ? "..." : "");
	}

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
