
import observer from "../../../core/util/Observer.js";
import DataList from "../../../components/inputs/DataList.js";
import GrupoGasto from "./GrupoGasto.js";

import irse from "../../model/Irse.js";
import gasto from "../../model/Gasto.js";

export default class TipoGasto extends DataList {
	hide() { this.parentNode.parentNode.hide(); } // hide GrupoGasto instance
	show() { this.parentNode.parentNode.show(); } // show GrupoGasto instance
	setVisible(visible) { this.parentNode.parentNode.setVisible(visible); }

	setEditable() {
		this.setVisible(irse.isEditable()); // GrupoGasto instance
	}

	isTicket = () => gasto.isTipoTicket(this.value);
	isPernocta = () => gasto.isTipoPernocta(this.value);
	isDoc = () => gasto.isTipoDoc(this.value);
	isExtra = () => gasto.isTipoExtra(this.value);
	isTaxi = () => gasto.isTipoTaxi(this.value);

	update = () => {
		const grupo = this.parentNode.parentNode; // GrupoGasto instance
		if (this.isPernocta())
			grupo.setPernocta();
		else if (this.isDoc())
			grupo.setDoc();
		else if (this.isExtra())
			grupo.setExtra();
		else if (this.isTaxi()) //ISU y taxi
			grupo.setTaxi();
		else if (this.getValue()) // ticket
			grupo.setTicket();
		else
			grupo.setDefault();
	}

	render = () => {
		this.replaceChildren(); // removes all children
		this.appendChild(new Option("", "")); // empty option

		if (irse.isFacturasComisionado()) { // facturas
			const optGroupFacturas = document.createElement("optgroup");
			optGroupFacturas.setAttribute("label", "Factura a nombre del comisionado");
			if (irse.getNochesPendientes() > 0)
				optGroupFacturas.appendChild(new Option("Por alojamiento", "9"));
			if (irse.getNumRutasPendientes() > 0)
				optGroupFacturas.appendChild(new Option("Por transporte interurbano (avión, tren...)", "8"));
			this.appendChild(optGroupFacturas);
		}

		const optGroupTickets = document.createElement("optgroup");
		optGroupTickets.setAttribute("label", "Tickets");
		if (irse.isIsu()) { // tickets
			optGroupTickets.appendChild(new Option("Peaje", "1"));
			optGroupTickets.appendChild(new Option("Aparcamiento", "2"));
			optGroupTickets.appendChild(new Option("Metro", "3"));
			optGroupTickets.appendChild(new Option("Taxi", "4"));
			optGroupTickets.appendChild(new Option("Autobús Urbano", "5"));
			optGroupTickets.appendChild(new Option("Tranvía", "6"));
			optGroupTickets.appendChild(new Option("Otros", "7"));
		}
		else
			optGroupTickets.appendChild(new Option("Tickets de transporte (taxi, parking, peajes...)", "10"));
		this.appendChild(optGroupTickets);

		const optGroupDoc = document.createElement("optgroup");
		optGroupDoc.setAttribute("label", "Otra Documentación");
		optGroupDoc.appendChild(new Option("Otra documentación acreditativa (Art. 61 NEP)", "201"));
		optGroupDoc.appendChild(new Option("Otra documentación (opcional)", "202"));
		this.appendChild(optGroupDoc);

		if (irse.isPaso8()) { // Gasto Extraordinario
			const optGroupP8 = document.createElement("optgroup");
			optGroupP8.setAttribute("label", "Gasto Extraordinario");
			optGroupP8.appendChild(new Option("Transporte", "301"));
			if (!irse.isMun())
				optGroupP8.appendChild(new Option("Alojamiento", "302"));
			if (irse.isCenaFinal())
				optGroupP8.appendChild(new Option("Cena final España", "303"));
			this.appendChild(optGroupP8);
		}
	}

	reset() {
		this.parentNode.parentNode.reset(); // GrupoGasto instance
		this.form.elements.fileGasto.reset(); // input file
		super.reset();
	}

	connectedCallback() {
		this.addChange(this.update); // set change event
		observer.subscribe("solicitud", this.render);
	}
}

customElements.define("grupo-gasto", GrupoGasto, { extends: "div" });
