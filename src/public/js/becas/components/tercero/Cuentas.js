
import beca from "../../model/Beca.js";
import DataList from "../../../core/components/forms/DataList.js";
import { getIban2, getEntidad } from "../../../data/bancos.js";

export default class Cuentas extends DataList {
	setEditable() {
		this.setReadonly(!beca.isEditable());
	}

	#update(cuenta) {
		this.form.paisEntidad.setVisible(!cuenta);
		this.form.iban.setVisible(!cuenta);

		if (cuenta) {
			this.form.iban.setValue(cuenta);
			this.form.entidad.setValue(getIban2(cuenta));
			this.form.entidad.setHidden();
		}
		else {
			this.form.iban.reset();
			this.form.entidad.reset();
			this.form.paisEntidad.reset();
		}
	}
	setValue(cuenta) {
		cuenta = cuenta || this.firstElementChild.value;
		super.setValue(cuenta); // set calculated value
		this.#update(cuenta); // update form fields
	}

	setCuentas(cuentas) {
		cuentas = cuentas || []; // container
		const labels = cuentas.map(cuenta => {
			const entidad = getEntidad(cuenta);
			return entidad ? (cuenta + " - " + entidad) : cuenta;
		});

		const newIban = this.lastElementChild;
		this.setValues(cuentas, labels);
		this.appendChild(newIban);
	}

	clear() {
		this.#update(); // update form fields
		this.replaceChildren(this.lastElementChild); // clear options
		return this.setData(null).reset(); // reset data
	}

	connectedCallback() { // init. component
		// IMPORTANT! force value = "", to avoid change event return text content
		this.appendChild(new Option("Dar de alta una nueva cuenta", "")); // create new account
		this.addChange(ev => this.#update(ev.target.value)); // update form fields
	}
}
