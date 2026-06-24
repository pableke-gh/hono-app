
import TextInput from "../../../core/components/forms/TextInput.js";
import pedido from "../../model/Pedido.js";

export default class Referencia extends TextInput {
	setEditable() {
		const filename = this.parentNode.nextElementSibling;
		filename.setText("").setVisible(pedido.isEditable());
		this.setDisabled(!pedido.isEditable());
	}

	validate() { // file or referencia required
		const file = this.form.elements["adjunto"];
		return file.isEmpty() ? this.force() : !this.setOk();
	}
}
