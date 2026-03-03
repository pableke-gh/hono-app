
import sb from "../../components/types/StringBox.js";
import TextInput from "./TextInput.js";

export default class TimeInput extends TextInput {
	constructor() {
		super(); // Must call super before 'this'

		// Initialize the element
		this.classList.add("ui-time");
	}

	setValue = value => super.setValue(sb.isoTime(value)); //hh:MM:ss
}
