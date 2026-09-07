
import beca from "../../model/Beca.js";
import tercero from "../../model/Tercero.js";
import DataList from "../../../core/components/forms/DataList.js";
import { getIban2, getEntidad } from "../../../data/bancos.js";

export default class Cuentas extends DataList {
	setEditable() {
		this.setReadonly(!beca.isEditable());
		this.form.imp.setReadonly(!beca.isEditable());
	}

	setModeNuevo() {
		tercero.setIbanNuevo();
		this.form.paisEntidad.setModeNuevo();
		this.form.iban.setModeNuevo(); // force visible
	}
	setModeActivo(cuenta) {
		if (!cuenta) // no cuenta => set new mode
			return this.setModeNuevo();
		tercero.setIbanActivo();
		this.form.paisEntidad.setModeActivo();
		this.form.entidad.setValue(getIban2(cuenta)); // update entidad de uxxiec
		this.form.iban.setModeActivo();
	}

	setValue(cuenta) {
		if (tercero.isIbanNuevo())
			this.setModeNuevo(); // new iban
		else {
			cuenta = cuenta || tercero.getIban() || this.firstElementChild.value;
			this.setModeActivo(cuenta); // update form fields for tercero
		}
		super.setValue(cuenta || "");  // default last option
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
		this.setModeNuevo(); // new iban
		this.replaceChildren(this.lastElementChild); // clear options
		return this.setData(null).reset(); // reset data
	}

	connectedCallback() { // init. component
		// IMPORTANT! force value = "", to avoid change event return text content
		this.appendChild(new Option("Dar de alta una nueva cuenta", "")); // create new account
		this.addChange(ev => this.setModeActivo(ev.target.value)); // update form fields
	}
}
