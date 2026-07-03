
import api from "../../../core/components/Api.js";
import i18n from "../../i18n/langs.js";
import Accordion from "../../../core/components/Accordion.js";
import TpvTable from "../tablas/Tpv.js";
import rb from "../../lib/RecibosBancarios.js";

export default class TpvAccordion extends Accordion {
	static getInstance = () => TpvAccordion.#instance;
	static #instance;
	#rows;

	connectedCallback() {
		TpvAccordion.#instance = this;
	}

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
		this.nextElementSibling.nextElementSibling.nextElementSibling.showBack(); // norma43-accordion
	}
	show() {
		super.show();
		this.showBack();
		this.previousElementSibling.classList.remove("hide"); // ul
		this.previousElementSibling.previousElementSibling.classList.remove("hide"); // h3
		document.forms.conciliar.elements.excel.show();
		document.forms.conciliar.setAccordion(this);
	}

	setData(contents) { // group by forma
		const n43 = rb.reset().n43Parse(contents);
		api.init().json("/uae/ttpp/tpv").then(tpvs => {
			// 1. agrupo todos los recibos del fichero por forma presupuestaria
			const grupos = Object.groupBy(n43.data, fila => { // temp1 = filas conciliables del tpv
				const tpv = tpvs.find(item => item.value.startsWith(rb.getTpv(fila))); // busco la conciliacion del tpv en la respuesta
				fila.forma = tpv ? (tpv.value + " - " + tpv.label) : fila.forma; // actualizo el texto de agrupacion
				return rb.normalize(fila).forma; // group by forma
			});

			this.#rows = n43.data; // store all recibos
			super.setData(grupos).renderGroup();
			this.previousElementSibling.render(n43);
			this.show();
		});
	}

	summary(el, key, status) { el.innerHTML = status.count + ".- " + key; }
	body(body, rows) {
		const table = new TpvTable(); // build table dynamically
		body.appendChild(table.view(rows)); // append table to details
		body.previousElementSibling.innerHTML += " (" + i18n.isoFloat(table.getProp("importe")) + " €)"; // summary element
	}

	getFilename = () => "tpv.xlsx";
	getHeaders = () => [ "Tipo", "F. Operación", "Descripción", "Importe" ];
	getExcel = () => this.#rows.map(row => { // map data to excel
		const { forma, fCobro, concepto, importe } = row;
		return { forma, fCobro, concepto, importe };
	});
}

customElements.define("tpv-table", TpvTable, { extends: "table" });
