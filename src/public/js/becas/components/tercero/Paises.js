
import sb from "../../../components/types/StringBox.js";
import beca from "../../model/Beca.js";
import DataList from "../../../core/components/forms/DataList.js";
import paises from "../../data/paises.js";

export default class Paises extends DataList {
	#entidad = this.form.elements.entidad;
	#banco = this.form.elements.banco;
	#swift = this.form.elements.swift;

	setEditable() {
		this.setReadonly(!beca.isEditable());
	}

	#update(pais) {
		const es = !pais || (pais == "ES");
		this.#entidad.setVisible(es);
		this.#banco.setVisible(!es);
		this.#swift.setVisible(!es);
		this.#banco.setValue(es ? this.#entidad.getText() : "");
	}
	setValue(pais) { super.setValue(pais).#update(pais); }
	reset() { super.reset().#update(this.value); }

	isEs() { return this.value == "ES"; }
	isExtranjero() { return !this.isEs(); }

	validate() {
		if (this.isExtranjero())
			this.#swift.force("Debe indicar el swift de la cuenta bancaria del beneficiario");
		const ok = this.#banco.force("Debe indicar el nombre de la entidad bancaria del beneficiario");
		return this.form.elements.iban.force("Debe indicar el IBAN del beneficiario") && ok;
	}

	connectedCallback() { // init. component
		this.setObject(paises);
		this.form.elements.residencia.innerHTML = this.innerHTML;
		this.#entidad.addEventListener("change", ev => this.#banco.setValue(this.#entidad.getText()));
		this.form.elements.iban.addEventListener("change", ev => { ev.target.value = sb.toUpperWord(ev.target.value); });
		this.#swift.addEventListener("change", ev => { ev.target.value = sb.toUpperWord(ev.target.value); });
		this.addChange(ev => this.setValue(ev.target.value));
	}
}
