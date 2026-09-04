
import beca from "../../model/Beca.js";
import DataList from "../../../core/components/forms/DataList.js";

export default class Entidades extends DataList {
	setVisible(visible) {
		super.setVisible(visible);
		this.form.banco.setVisible(!visible);
	}
	setHidden() {
		this.hide();
		this.form.banco.hide();
	}

	setEditable() {
		this.setReadonly(!beca.isEditable());
		this.form.banco.setReadonly(!beca.isEditable());
		this.form.swift.setReadonly(!beca.isEditable());
	}

	setValue(entidad) {
		super.setValue(entidad);
		this.form.banco.setValue(this.getText())
	}

	reset() {
		super.reset();
		this.form.banco.reset()
	}

	validate() {
		return this.form.banco.force("Debe indicar el nombre de la entidad bancaria del beneficiario");
	}

	connectedCallback() { // init. component
		this.addChange(ev => this.form.banco.setValue(this.getText()));
	}
}
