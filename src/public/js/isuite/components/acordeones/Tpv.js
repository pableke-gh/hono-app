
import api from "../../../core/components/Api.js";
import i18n from "../../i18n/langs.js";
import Accordion from "../../../core/components/Accordion.js";
import TpvTable from "../tablas/Tpv.js";
import rb from "../../lib/RecibosBancarios.js";

export default class TpvAccordion extends Accordion {
	static #instance;
	static getInstance = () => TpvAccordion.#instance;

	connectedCallback() {
		TpvAccordion.#instance = this;
	}


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

			const names = Object.keys(grupos).sort(); // 2. Calling sort() without arguments sorts strings lexicographically
			super.setData(names).getTabs().forEach((tab, i) => { // 3. Construyo dinamicamente los acordeones + sub-tablas
				const rows = grupos[names[i]]; // recibos del grupo
				const table = new TpvTable(); // build table dynamically
				tab.lastElementChild.appendChild(table.view(rows)); // append table to details
				tab.firstElementChild.innerHTML += " (" + i18n.isoFloat(table.getProp("importe")) + " €)"; // summary element
			});

			this.previousElementSibling.render(n43);
			this.show();
		});
	}

	render = (key, status) => `<details><summary>${status.count}.- ${key}</summary><div></div></details>`;
}

customElements.define("tpv-table", TpvTable, { extends: "table" });
