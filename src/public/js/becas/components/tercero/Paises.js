
import beca from "../../model/Beca.js";
import tercero from "../../model/Tercero.js";
import DataList from "../../../core/components/forms/DataList.js";
import paises from "../../data/paises.js";

export default class Paises extends DataList {
	setEditable() {
		this.setReadonly(!beca.isEditable());
	}

	isEs() { return (this.value == "ES"); }
	isExtranjero() { return !this.isEs(); }

	setEntidades() {
		this.form.entidad.setModeNuevo(this.isEs());
		this.form.swift.setVisible(!this.isEs());
	}
	setModeNuevo() {
		this.show(); // show paises
		this.setValue(tercero.getPaisEntidad());
		this.setEntidades();
	}
	setModeActivo() {
		this.hide(); // hide paises
		this.setValue("ES"); // default = ES
		this.form.entidad.setModeActivo();
	}

	validate() {
		return this.isEs() || this.form.swift.force("Debe indicar el swift de la cuenta bancaria del beneficiario");
	}

	connectedCallback() { // init. component
		this.setObject(paises);
		this.form.residencia.innerHTML = this.innerHTML; // clone contents
		this.addChange(ev => this.setEntidades());
	}
}
