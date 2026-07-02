
import api from "../../../core/components/Api.js";
import i18n from "../../i18n/langs.js";
import Accordion from "../../../core/components/Accordion.js";
import Norma57Table from "../tablas/Norma57.js";
import rb from "../../lib/RecibosBancarios.js";

export default class Norma57Accordion extends Accordion {
	static #instance;
	static getInstance = () => Norma57Accordion.#instance;

	connectedCallback() {
		Norma57Accordion.#instance = this;
	}

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
	}

	setData(contents) {
		const n57 = rb.reset().n57Parse(contents);
		n57.referencias = rb.references().join(); // referencias leidas del fichero bancario
		const temp1 = n57.data.filter(rb.isConciliable); // filas conciliables
		const aux = Object.copy({}, n57, [ "tipo", "ccc", "fInicio", "fFin", "referencias" ]);
		api.setJSON(aux).json("/uae/ttpp/load").then(data => { // llamada post
			// 1. agrupo todos los recibos del fichero por aplicacion presupuestaria
			const grupos = Object.groupBy(temp1, fila => { // temp1 = filas conciliables del fichero bancario
				const recibo = data.recibos.find(recibo => (recibo.refreb == fila.ref1)); // busco la conciliacion en la respuesta
				recibo && rb.acLoad(fila, recibo); // añado los datos de academico (merge)
				return fila.aplicacion + " - " + fila.aplicacionDesc; // group by aplicacion
			});

			const names = Object.keys(grupos).sort(); // 2. Calling sort() without arguments sorts strings lexicographically
			super.setData(names).getTabs().forEach((tab, i) => { // 3. Construyo dinamicamente los acordeones + sub-tablas
				const rows = grupos[names[i]]; // recibos del grupo
				const table = new Norma57Table(); // build table dynamically
				tab.lastElementChild.appendChild(table.view(rows)); // append table to details
				tab.firstElementChild.innerHTML += " (" + i18n.isoFloat(table.getProp("importe")) + " €)"; // summary element
			});

			delete n57.referencias;
			this.previousElementSibling.render(n57);
			document.forms.conciliar.elements.save.show();
			this.show();
		});
	}

	render = (key, status) => `<details><summary>${status.count}.- ${key}</summary><div></div></details>`;
}

customElements.define("norma57-table", Norma57Table, { extends: "table" });
