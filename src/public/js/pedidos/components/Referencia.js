
import TextInput from "../../components/inputs/TextInput.js";
import observer from "../../core/util/Observer.js";
import pedido from "../model/Pedido.js";

export default class Referencia extends TextInput {
	connectedCallback() { // default initialization
		const filename = this.parentNode.nextElementSibling;
		observer.subscribe("adjunto", input => filename.setText(input.getFilename()));
	}

	setEditable() {
		const filename = this.parentNode.nextElementSibling;
		filename.setText("").setVisible(pedido.isEditable());
		this.setDisabled(!pedido.isEditable());
	}

	validate() { // file or referencia required
		const file = this.form.elements["adjunto"];
		return file.isEmpty() ? this.force() : this.setOk();
	}
}
