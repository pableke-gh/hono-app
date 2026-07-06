
import Accordion from "../../../core/components/Accordion.js";
import api from "../../../core/components/Api.js";
import i18n from "../../i18n/langs.js";
import FlywireTable from "../tablas/Flywire.js";

export default class FlywireAccordion extends Accordion {
	static getInstance = () => FlywireAccordion.#instance;
	static #instance;
	#rows;

	connectedCallback() {
		FlywireAccordion.#instance = this;
	}

	getName = () => "flywire";
	size() { return this.#rows ? this.#rows.length : 0; }
	isEmpty() { return !this.#rows || super.isEmpty(); }
	isLoaded() { return this.#rows && super.isLoaded(); }
	reset() { this.#rows = null; super.reset(); }

	hide() {
		super.hide();
		const back = this.nextElementSibling;
		this.previousElementSibling.classList.add("hide");
		back.nextElementSibling.classList.add("hide"); // button
		back.classList.add("hide"); // hr
	}
	showBack() {
		const back = this.nextElementSibling;
		back.nextElementSibling.classList.remove("hide"); // button
		back.classList.remove("hide"); // hr
	}
	show() {
		super.show();
		this.showBack();
		this.previousElementSibling.classList.remove("hide");
		document.forms.conciliar.elements.excel.show();
		document.forms.conciliar.setAccordion(this);
	}

	setData(contents) {
		try {
			const recibos = JSON.parse(contents);
			const referencias = recibos.data.map(item => item.recibo).join(); // extract references
			api.setJSON({ tipo: recibos.empresa, referencias }).json("/uae/ttpp/flywire").then(data => {
				// 1. agrupo los recibos por aplicacion presupuestaria
				const grupos = Object.groupBy(data.recibos, recibo => { // merge and group data
					Object.assign(recibo, recibos.data.find(rf => (rf.recibo == recibo.refreb)));
					recibo.desc = (recibo.org == "300955") ? "SERVICIO DE GESTIÓN ACADÉMICA" : recibo.desc;
					return recibo.org + " " + recibo.eco + ": " + recibo.desc; // group by aplicacion
				});

				this.#rows = data.recibos; // 2. store all recibos
				super.setData(grupos).renderGroup(); // 3. render accordion
				this.show(); // 4. show accordion
			});
		} catch(ex) {
			console.error("Error parsing Flywire JSON data:", ex);
			document.forms.conciliar.elements.fichero.setError("Formato de fichero incorrecto", "No se puede procesar el contenido del fichero Flywire.");
		}
	}

	summary(el, key, status) { el.innerHTML = status.count + ".- " + key; }
	body(body, rows) {
		const table = new FlywireTable(); // build table dynamically
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

customElements.define("flywire-table", FlywireTable, { extends: "table" });
