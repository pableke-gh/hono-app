
import DataList from "../../../core/components/forms/DataList.js";
import OrganicaDec from "./Organica.js";

export default class Ejercicio extends DataList {
	connectedCallback() {
		const fnSync = ev => {
			this.setValue(ev.target.value);
			this.form.elements.ejInc.setValue(ev.target.value);
			this.form.elements.ej030.setValue(ev.target.value);
		}

		this.addChange(fnSync).addChange(this.form.elements.orgDec.reload);
		this.form.elements.ejInc.addChange(fnSync);
		this.form.elements.ej030.addChange(fnSync);
	}

	setLabels(ejercicios) {
		super.setLabels(ejercicios);
		this.form.elements.ejInc.setLabels(ejercicios);
		this.form.elements.ej030.setLabels(ejercicios);
		return this;
	}
}

customElements.define("organica-dec", OrganicaDec, { extends: "input" });
