
import sb from "../../../components/types/StringBox.js";
import beca from "../../model/Beca.js";
import DataList from "../../../core/components/forms/DataList.js";

export default class Paises extends DataList {
	#entidades = this.form.elements.entidades;
	#banco = this.form.elements.banco;
	#swift = this.form.elements.swift;

	setEditable() {
		this.setReadonly(!beca.isEditable());
	}

	setValue(pais) {
		const es = !pais || (pais == "ES");
		this.#entidades.setVisible(es);
		this.#banco.setVisible(!es);
		this.#swift.setVisible(!es);
		super.setValue(pais);
	}

	connectedCallback() { // init. component
		this.addChange(ev => {
			this.setValue(ev.target.value);
			this.#banco.setValue();
		});

		this.#entidades.addEventListener("change", ev => this.#banco.setValue(this.#entidades.getText()));
		this.#swift.addEventListener("change", ev => { ev.target.value = sb.toWord(ev.target.value); });
	}
}
