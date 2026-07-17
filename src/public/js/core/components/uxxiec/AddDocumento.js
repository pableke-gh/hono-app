
import ButtonForm from "../forms/ButtonForm.js"

export default class AddDocumento extends ButtonForm {
	execute() {
		const docElem = this.form.elements.uxxi;
		if (docElem.isLoaded()) // add document to table
			this.form.nextElementSibling.add(docElem.getCurrent())
		docElem.reload(); // Reload autocomplete
	}
}
