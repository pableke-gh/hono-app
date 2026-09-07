
import beca from "../../model/Beca.js";
import tercero from "../../model/Tercero.js";
import DataList from "../../../core/components/forms/DataList.js";

export default class Entidades extends DataList {
	setEditable() {
		this.setReadonly(!beca.isEditable());
		this.form.banco.setReadonly(!beca.isEditable());
	}

	setModeNuevo(es) {
		this.setVisible(es);
		this.form.banco.setVisible(!es); // inti. banco
		this.form.banco.setValue(es ? this.getText() : "");
	}
	setModeActivo() {
		this.hide();
		this.form.banco.hide();
	}

	setValue(entidad) {
		super.setValue(entidad);
		this.form.banco.setValue(this.getText());
	}

	reset() {
		super.reset();
		this.form.banco.setValue(this.getText());
	}

	validate() {
		return this.form.banco.force("Debe indicar el nombre de la entidad bancaria del beneficiario");
	}

	connectedCallback() { // init. component
		this.addChange(ev => this.form.banco.setValue(this.getText()));
	}
}
