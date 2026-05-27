
import irse from "../../model/Irse.js";
import interesado from "../../model/Interesado.js";
import gastos from "../../model/Gastos.js";
import observer from "../../../core/util/Observer.js";
import DataList from "../../../components/inputs/DataList.js";

export default class EquipoGobierno extends DataList {
	load() { this.setValue(gastos.getGrupoDieta()); }
	setEditable() { this.setReadonly(!irse.isEditable()); }

	// final arrow functions to preserve "this" context
	setVisible = () => this.parentNode.parentNode.setVisible(interesado.isEquipoGob());
	isGrupoDieta1 = () => (this.value == "1");
	isGrupoDieta2 = () => (this.value == "2");

	connectedCallback() { // init component
		observer.subscribe("interesado", this.setVisible);
	}
}
