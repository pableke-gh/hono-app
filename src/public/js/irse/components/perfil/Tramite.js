
import irse from "../../model/Irse.js";
import form from "../../modules/irse.js"
import DataList from "../../../components/inputs/DataList.js";
import observer from "../../../core/util/Observer.js";

export default class Tramite extends DataList {
	hide() { this.parentNode.parentNode.classList.add("hide"); }
	show() { this.parentNode.parentNode.classList.remove("hide"); }

	load() {
		this.setValue(irse.getTramite());
	}
	setEditable() {
		this.setVisible(irse.isUxxiec());
		this.setReadonly(!irse.isEditableP0());
	}

	connectedCallback() { // init. component
		observer.subscribe("perfil", () => { // changes in perfil
			this.select(this.form.elements.actividad.isCom() ? 7 : 1); // default = AyL
		});
	}
}
