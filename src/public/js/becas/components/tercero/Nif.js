
import sb from "../../../components/types/StringBox.js";
import api from "../../../core/components/Api.js";
import doc from "../../i18n/Documento.js";
import TextInput from "../../../core/components/forms/TextInput.js";

export default class NifTercero extends TextInput {
	setDocumento(value) {
		value = value ?? this.value;
		if (doc.isDni(value) || doc.isCif(value))
			this.form.doc.setValue(1);
		else if (doc.isNie(value))
			this.form.doc.setValue(2);
		else
			this.form.doc.setValue(11);
	}

	setValue(value) {
		super.setValue(value); // set new value
		this.setEditable(!value); // update editable state
		this.setDocumento(value); // update tipo documento
	}

	reset() {
		super.reset();
		this.setEditable(true);
	}

	connectedCallback() {
		this.addChange(ev => {
			this.setValue(sb.toUpperWord(ev.target.value));
			if (sb.size(this.value) < 6) return; // nif invalido
			api.init().json("/uae/becas/tercero/nif", { nif: this.value }).then(data => {
				this.form.load(data.tercero, data.cuentas); // update inputs
			});
		});
	}
}
