
import sb from "../../../components/types/StringBox.js";
import DataList from "../../../components/inputs/DataList.js";

export default class Cuentas extends DataList {
	#fMax = this.form.elements.fMax;
	#extra = this.form.elements.extra;

	setEditable(model) {
		this.setReadonly(!model.isEditable());
	}

	isNormal = () => (this.value == "1");
	isUrgente = () => (this.value == "2");
	toggle = () => {
		const isUrgente = this.isUrgente();
		this.#fMax.parentNode.setVisible(isUrgente);
		this.#extra.parentNode.setVisible(isUrgente);
	}

	setValue(value) {
		super.setValue(value ? "2" : "1"); // 1 = normal / 2 = urgente
		this.#fMax.parentNode.setVisible(this.isUrgente());
		this.#extra.parentNode.setVisible(this.isUrgente());
	}

	validate() {
		if (this.isNormal())
			return true; // no validation for normal
		let ok = true; // indicator
		if (sb.size(this.#extra.value) < 1)
			ok = !this.form.setRequired(this.#extra, "Debe indicar un motivo para la urgencia de esta solicitud.");
		if (!this.#fMax.value) // empty date
			ok = !this.form.setRequired(this.#fMax, "Debe indicar una fecha maxima de resolución para esta solicitud.");
		if (sb.isoDate((new Date()).toISOString().substring(0, 10)) < this.#fMax.value)
			ok = !this.form.setRequired(this.#fMax, "La fecha de resolución debe ser posterior al dia de hoy.");
		return ok; // validate urgente fields
	}

	connectedCallback() {
		this.addChange(this.toggle);
	}
}
