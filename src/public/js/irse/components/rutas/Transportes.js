
import irse from "../../model/Irse.js";
import ruta from "../../model/Ruta.js";
import DataList from "../../../components/inputs/DataList.js";

export default class Transportes extends DataList {
	setEditable() {
		this.setReadonly(!irse.isEditable());
	}

	setTipo(value) {
		this.setValue(value || ""); // default empty option
		const ok = ruta.isTipoVP(this.value); // is vehiculo propio
		this.form.elements.matricula.setVisible(ok); // matricula en rutas
	}

	connectedCallback() {
		this.addChange(ev => this.setTipo(ev.target.value));
	}
}
