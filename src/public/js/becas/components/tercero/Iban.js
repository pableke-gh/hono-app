
import sb from "../../../components/types/StringBox.js";
import beca from "../../model/Beca.js";
import tercero from "../../model/Tercero.js";
import TextInput from "../../../core/components/forms/TextInput.js";

export default class Iban extends TextInput {
	setEditable() {
		this.setReadonly(!beca.isEditable());
		this.form.swift.setReadonly(!beca.isEditable());
	}

	setModeNuevo() {
		this.show(); // force visible
	}
	setModeActivo() {
		this.hide(); // force hide
		this.form.swift.hide(); // hide swift input
	}

	setValue(value) {
		super.setValue(value || this.form.cuentas.value);
	}

	validate() {
		return this.force("Debe indicar el IBAN del beneficiario");
	}

	connectedCallback() { // init. component
		const fnChange = ev => { ev.target.value = sb.toUpperWord(ev.target.value); }
		this.form.swift.addEventListener("change", fnChange);
		this.addChange(fnChange);
	}
}
