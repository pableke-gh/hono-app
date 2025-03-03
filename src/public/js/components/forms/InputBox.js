
/**
 * InputBox
 * Helper class for input fields
 * important! elements must exists
 */
function InputBox() {
	const self = this; //self instance

	this.addEvent = (el, name, fn) => el.addEventListener(name, ev => fn(ev, el));
	this.addChange = (el, fn) => self.addEvent(el, "change", fn);
	this.addClick = (el, fn) => self.addEvent(el, "click", fn);

	this.setValue = (el, value) => { // el must exists
		if ((el.tagName == "SELECT") && !value)
			el.selectedIndex = 0; // first option
		else
			el.value = value || ""; // force String
	}

	this.onChangeFile = (el, fn) => {
		let file, index = 0; // file, position;
		const reader = new FileReader();
		const fnLoad = i => {
			file = el.files[i]; // multifile
			file && reader.readAsArrayBuffer(file); //reader.readAsText(file, "UTF-8");
		}
		reader.onload = ev => { // event on load file
			fn(el, file, reader.result, index);
			fnLoad(++index);
		}
		el.addEventListener("change", () => fnLoad(index));
		return self; // self instance
	}
}

export default new InputBox();
