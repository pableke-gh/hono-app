
import api from "../../../core/components/Api.js";
import i18n from "../../i18n/langs.js";
import Accordion from "../../../core/components/Accordion.js";
import Norma57Table from "../tablas/Norma57.js";
import rb from "../../lib/RecibosBancarios.js";

export default class Norma57Accordion extends Accordion {
	static getInstance = () => Norma57Accordion.#instance;
	static #instance;
	#rows;

	connectedCallback() {
		Norma57Accordion.#instance = this;
	}

	getName = () => "norma57";
	size() { return this.#rows ? this.#rows.length : 0; }
	isEmpty() { return !this.#rows || super.isEmpty(); }
	isLoaded() { return this.#rows && super.isLoaded(); }
	reset() { this.#rows = null; super.reset(); }

	hide() {
		super.hide();
		this.previousElementSibling.classList.add("hide"); // ul
		this.previousElementSibling.previousElementSibling.classList.add("hide"); // h3
	}
	showBack() {
		this.nextElementSibling.nextElementSibling.showBack(); // flywire-accordion
	}
	show() {
		super.show();
		this.showBack();
		this.previousElementSibling.classList.remove("hide"); // ul
		this.previousElementSibling.previousElementSibling.classList.remove("hide"); // h3
		document.forms.conciliar.elements.save.show();
		document.forms.conciliar.elements.excel.show();
		document.forms.conciliar.setAccordion(this);
	}

	setData(contents) {
		const n57 = rb.reset().n57Parse(contents);
		n57.referencias = rb.references().join(); // referencias leidas del fichero bancario
		this.#rows = n57.data.filter(rb.isConciliable); // filas conciliables
		const aux = Object.copy({}, n57, [ "tipo", "ccc", "fInicio", "fFin", "referencias" ]);
		api.setJSON(aux).json("/uae/ttpp/load").then(data => { // llamada post
			// 1. agrupo todos los recibos del fichero por aplicacion presupuestaria
			const grupos = Object.groupBy(this.#rows, fila => { // this.#rows = filas conciliables del fichero bancario
				const recibo = data.recibos.find(recibo => (recibo.refreb == fila.ref1)); // busco la conciliacion en la respuesta
				recibo && rb.acLoad(fila, recibo); // añado los datos de academico (merge)
				return fila.aplicacion + " - " + fila.aplicacionDesc; // group by aplicacion
			});

			delete n57.referencias;
			super.setData(grupos).renderGroup();
			this.previousElementSibling.render(n57);
			this.show();
		});
	}

	summary(el, key, status) { el.innerHTML = status.count + ".- " + key; }
	body(body, rows) {
		const table = new Norma57Table(); // build table dynamically
		body.appendChild(table.view(rows)); // append table to details
		body.previousElementSibling.innerHTML += " (" + i18n.isoFloat(table.getProp("importe")) + " €)"; // summary element
	}

	getHeaders = () => [
		"F. Operación", "Nombre del Plan", "Act.", "Nombre de la Act.", "DNI Alumno", "Nombre del Alumno", "Orgánica", "Económica", "Importe"
	];
	getExcel = () => this.#rows.map(row => { // map data to excel
		const { fCobro, plan, idActividad, actNombre, dnialu, nombre, org, eco, importe } = row;
		return { fCobro, plan, idActividad, actNombre, dnialu, nombre, org, eco, importe };
	});
}

customElements.define("norma57-table", Norma57Table, { extends: "table" });
