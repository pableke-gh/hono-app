
import beca from "../../model/Beca.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class BasesButton extends ButtonForm {
	setModeAdjunto() {
		this.innerHTML = 'Bases de la convocatoria<i class="far fa-paperclip"></i>';
		this.title = "Descargar / visualizar las bases de la convocatoria";
		return this.show();
	}
	setModeSelect() {
		this.innerHTML = '<i class="fas fa-search"></i>Adjuntar bases de la convocatoria';
		this.title = "Bases de la convocatoria asociada a la solicitud";
		return this.show();
	}
	setEditable() {
		if (beca.getBases())
			this.setModeSelect();
		else
			this.setModeAdjunto();
	}

	validate() {
		const file = this.form.elements.bases;
		return file.isLoaded() || file.setRequired(this, "Debe adjuntar las bases de la convocatoria");
	}

	connectedCallback() {
		this.addEventListener("click", ev => {
			this.form.elements.bases.click();
		});
	}
}
