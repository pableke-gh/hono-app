
import sb from "../../../components/types/StringBox.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js";
import gastos from "../../model/Gastos.js";
import DataList from "../../../components/inputs/DataList.js";

export default class Paises extends DataList {
	#entidades = this.form.elements["entidades"];
	#banco = this.form.elements["banco"];
	#swift = this.form.elements["swift"];

	load() {
		this.setValue(gastos.getPaisEntidad());
	}

	setEditable() {
		this.setReadonly(!irse.isEditable());
	}

	setValue(pais) {
		const es = !pais || (pais == "ES");
		this.#entidades.setVisible(es);
		this.#banco.setVisible(!es);
		this.#swift.parentNode.setVisible(!es);
		super.setValue(pais);
	}
	setEntidad(entidad) {
		this.#entidades.setValue(entidad);
	}
	setGrupoIban() {
		this.#entidades.setValue(gastos.getCodigoEntidad());
		this.#banco.setValue(gastos.getNombreEntidad());
		this.#swift.setValue(gastos.getSwift());
	}

	connectedCallback() { // init. component
		this.setObject(i18n.getPaises()).addChange(ev => {
			this.setValue(ev.target.value);
			this.#banco.setValue();
		});

		this.#entidades.addEventListener("change", ev => this.#banco.setValue(this.#entidades.getText()));
		this.#swift.addEventListener("change", ev => { ev.target.value = sb.toWord(ev.target.value); });
	}
}
