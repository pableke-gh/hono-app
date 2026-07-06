
import DataList from "../../../components/inputs/DataList.js";
import OrganicaDec from "./Organica.js";
import presto from "../../model/Presto.js";

export default class Ejercicio extends DataList {
	connectedCallback() {
		const fnSync = ev => {
			this.setValue(ev.target.value);
			this.form.elements.ejInc.setValue(ev.target.value);
			this.form.elements.ej030.setValue(ev.target.value);
		}

		this.addChange(fnSync).addChange(this.form.elements.orgDec.reload);
		this.form.elements.ejInc.addEventListener("change", fnSync);
		this.form.elements.ej030.addEventListener("change", fnSync);
	}

	setEditable() {
		this.setReadonly(!presto.isEditable());
		this.parentNode.parentNode.parentNode.classList.toggle("hide", !presto.isPartidaDec()); // show / hide partida dec group
	}

	setLabels(ejercicios) { // force reload
		super.setLabels(ejercicios).reset();
		this.form.elements.ejInc.setLabels(ejercicios).reset();
		this.form.elements.ej030.setLabels(ejercicios).reset();
		this.value = this.form.elements.ejInc.value = this.form.elements.ej030.value = presto.get("ej");
	}
}

customElements.define("organica-dec", OrganicaDec, { extends: "input" });
