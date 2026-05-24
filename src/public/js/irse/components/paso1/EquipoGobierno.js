
import irse from "../../model/Irse.js";
import interesado from "../../model/Interesado.js";
import gastos from "../../model/Gastos.js";
import observer from "../../../core/util/Observer.js";
import DataList from "../../../components/inputs/DataList.js";

export default class EquipoGobierno extends DataList {
	setVisible = () => this.parentNode.parentNode.setVisible(interesado.isEquipoGob());
	setEditable() {
		this.setVisible();
		this.setReadonly(!irse.isEditable());
		this.setValue(gastos.getGrupoDieta());
	}

	isGrupoDieta1 = () => (this.value == "1");
	isGrupoDieta2 = () => (this.value == "2");

	connectedCallback() { // init component
		observer.subscribe("interesado", this.setVisible);
	}
}
