
import TextInput from "../../../core/components/forms/TextInput.js";
import sb from "../../../components/types/StringBox.js";
import doc from "../../i18n/Documento.js";

export default class NifTercero extends TextInput {
	connectedCallback() {
		this.addChange(ev => {
			ev.target.value = sb.toUpperWord(ev.target.value);

			if (doc.isDni(this.value) || doc.isCif(this.value))
				this.form.elements.doc.setValue(1);
			else if (doc.isNie(this.value))
				this.form.elements.doc.setValue(2);
			else
				this.form.elements.doc.setValue(11);
		});
	}
}
