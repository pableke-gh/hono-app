
import beca from "../../model/Beca.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class BeneficiariosButton extends ButtonForm {
	setModeAdjunto() {
		this.innerHTML = 'Anexo de beneficiarios<i class="far fa-paperclip"></i>';
		this.title = "Descargar / visualizar el anexo de beneficiarios";
		return this.show();
	}
	setModeSelect() {
		this.innerHTML = '<i class="fas fa-search"></i>Adjuntar anexo de beneficiarios';
		this.title = "Anexo de beneficiarios asociados a la solicitud";
		return this.show();
	}
	setEditable() {
		if (beca.getBeneficiarios())
			this.setModeSelect();
		else if (beca.isEditable())
			this.setModeAdjunto();
		else
			this.hide();
	}

	connectedCallback() {
		this.addEventListener("click", ev => {
			this.form.elements.beneficiarios.click();
		});
	}
}
