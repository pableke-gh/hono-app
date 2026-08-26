
import sb from "../../../components/types/StringBox.js";
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

	// show / hide grupo partida a decrementar
	hide() { this.parentNode.parentNode.parentNode.classList.add("hide"); }
	show() { this.parentNode.parentNode.parentNode.classList.remove("hide"); }

	setEditable() {
		this.setVisible(presto.isPartidaDec());
		this.setReadonly(!presto.isEditable());
		const fnFocus = () => { presto.isPartidaDec() ? this.focus() : this.form.elements.ejInc.focus(); }
		setTimeout(fnFocus, 9); // set focus on first input after view is loaded
	}

	// executed onView after load data
	setLabels(ejercicios) { // force reload
		super.setLabels(ejercicios).reset();
		this.form.elements.ejInc.setLabels(ejercicios).reset();
		this.form.elements.ej030.setLabels(ejercicios).reset();

		const ej = presto.get("ej") || sb.getYear();
		this.value = this.form.elements.ejInc.value = this.form.elements.ej030.value = ej;
	}
}

customElements.define("organica-dec", OrganicaDec, { extends: "input" });
