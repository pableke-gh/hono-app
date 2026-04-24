
import TextInput from "../../components/inputs/TextInput.js";

export default class Referencia extends TextInput {
	validate() { // file or referencia required
		const file = this.form.elements["adjunto"];
		return file.isEmpty() ? this.force() : this.setOk();
	}
}
