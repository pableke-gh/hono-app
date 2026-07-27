
import factura from "../../model/Factura.js"
import observer from "../../../core/util/Observer.js";
import TextArea from "../../../components/inputs/TextArea.js";

export default class Memoria extends TextArea {
	setEditable() {
		this.setReadonly(!factura.isEditableGaca());
	}

	update = () => {
		this.setVisible(factura.isMemo());
	}

	connectedCallback() {
		observer.subscribe("form-updated", this.update); // update state of face inputs
	}
}
