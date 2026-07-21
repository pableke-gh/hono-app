
import sb from "../../../components/types/StringBox.js";
import valid from "../../i18n/validators/irse.js";

import irse from "../../model/Irse.js";
import gastos from "../../model/Gastos.js";
import DataList from "../../../components/inputs/DataList.js";

export default class Cuentas extends DataList {
	#paises = this.form.elements.paises;
	#iban = this.form.elements.iban;

	setEditable() {
		this.setReadonly(!irse.isEditable());
	}

	load() {
		this.setValue(gastos.getPaisEntidad());
	}

	setValue(cuenta) {
		this.#paises.parentNode.parentNode.setVisible(!cuenta); // toggle grupo-iban
		super.setValue(cuenta);
	}

	setCuentas(cuentas) {
		cuentas = cuentas || []; // container
		const iban = gastos.getCodigoIban(); // can be new in system
		const cuenta = iban ? (cuentas.includes(iban) ? iban : "") : (cuentas[0] || "");
		const labels = cuentas.map(cuenta => {
			const entidad = valid.getBanks().getEntidad(cuenta);
			return entidad ? (cuenta + " - " + entidad) : cuenta;
		});

		cuentas.push(""); // IMPORTANT! force value = "", to avoid change event return text content
		labels.push("Dar de alta una nueva cuenta"); // input select label
		this.setValues(cuentas, labels);
		// IMPORTANT! force value = "", to avoid change event return text content
		//this.add(new Option("Dar de alta una nueva cuenta", ""));
		this.setValue(cuenta);
		this.#paises.setGrupoIban();
		this.#iban.setValue(iban || cuenta);
	}

	connectedCallback() { // init. component
		this.addChange(ev => {
			const value = ev.target.value;
			this.#paises.setEntidad(sb.substr(value, 4, 4));
			this.#iban.setValue(value);
			this.setValue(value);
		});

		this.#iban.addEventListener("change", ev => { ev.target.value = sb.toWord(ev.target.value); });
	}

}
