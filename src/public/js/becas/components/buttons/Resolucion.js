
import beca from "../../model/Beca.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class ResolucionButton extends ButtonForm {
	setModeAdjunto() {
		this.innerHTML = 'Bases de la convocatoria<i class="far fa-paperclip"></i>';
		this.title = "Descargar / visualizar la resolución o acuerdo de concesión";
		return this.show();
	}
	setModeSelect() {
		this.innerHTML = '<i class="fas fa-search"></i>Adjuntar resolución o acuerdo de concesión';
		this.title = "Resolución o acuerdo de concesión asociado a la solicitud";
		return this.show();
	}
	setEditable() {
		if (beca.getResolucion())
			this.setModeSelect();
		else
			this.setModeAdjunto();
	}

	validate() {
		const file = this.form.elements.resolucion;
		return file.isLoaded() || file.setRequired(this, "Debe adjuntar la resolución o acuerdo de la concesión");
	}

	connectedCallback() {
		this.addEventListener("click", ev => {
			this.form.elements.resolucion.click();
		});
	}
}
