
import irse from "../../model/Irse.js";
import interesado from "../../model/Interesado.js";
import observer from "../../../core/util/Observer.js";
import DataList from "../../../components/inputs/DataList.js";

export default class EquipoGobierno extends DataList {
	setVisible() {
		this.parentNode.parentNode.setVisible(interesado.isEquipoGob());
	}
	setEditable() {
		this.setVisible();
		this.setReadonly(!irse.isEditable());
	}

	connectedCallback() { // init component
		observer.subscribe("interesado", () => this.setVisible());
	}
}
