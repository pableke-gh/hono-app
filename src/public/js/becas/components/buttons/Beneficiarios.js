
import beca from "../../model/Beca.js";
import tables from "../tables/tables.js";
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
			this.setModeAdjunto();
		else if (beca.isEditable())
			this.setModeSelect();
		else
			this.hide();
		this.nextElementSibling.classList.add("hide");
	}

	validate() {
		const terceros = tables.get("terceros");
		const file = this.form.elements.beneficiarios;
		return file.isLoaded() || terceros.size() || file.setRequired("Debe indicar quienes son los beneficiarios de la solicitud");
	}

	connectedCallback() {
		const remove = this.nextElementSibling;
		const file = this.form.elements.beneficiarios;
		const anexo = tables.get("terceros").parentNode;

		this.addEventListener("click", ev => file.click());
		file.addEventListener("change", ev => {
			anexo.classList.toggle("hide", file.isLoaded());
			remove.classList.toggle("hide", !file.isLoaded());
		});
		remove.addEventListener("click", ev => {
			anexo.classList.remove("hide");
			remove.classList.add("hide");
			ev.preventDefault();
			file.reset();
		});
	}
}
