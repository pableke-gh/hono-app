
import sb from "../../../components/types/StringBox.js";
import beca from "../../model/Beca.js";

import DataList from "../../../core/components/forms/DataList.js";
import paises from "../../data/paises.js";

export default class Paises extends DataList {
	setEditable() {
		this.setReadonly(!beca.isEditable());
	}

	#update(pais) {
		const es = !pais || (pais == "ES");
		this.form.entidad.setVisible(es);
		this.form.banco.setVisible(!es);
		this.form.swift.setVisible(!es);
		this.form.banco.setValue(es ? this.form.entidad.getText() : "");
	}
	setValue(pais) { super.setValue(pais).#update(pais); }
	reset() { super.reset().#update(this.value); }

	isEs() { return this.value == "ES"; }
	isExtranjero() { return !this.isEs(); }

	validate() {
		if (this.isExtranjero())
			this.form.swift.force("Debe indicar el swift de la cuenta bancaria del beneficiario");
		const ok = this.form.banco.force("Debe indicar el nombre de la entidad bancaria del beneficiario");
		return this.form.iban.force("Debe indicar el IBAN del beneficiario") && ok;
	}

	connectedCallback() { // init. component
		this.setObject(paises);
		this.form.residencia.innerHTML = this.innerHTML; // clone contents
		this.form.entidad.addEventListener("change", ev => this.form.banco.setValue(this.form.entidad.getText()));
		this.form.iban.addEventListener("change", ev => { ev.target.value = sb.toUpperWord(ev.target.value); });
		this.form.swift.addEventListener("change", ev => { ev.target.value = sb.toUpperWord(ev.target.value); });
		this.addChange(ev => this.setValue(ev.target.value));
	}
}
