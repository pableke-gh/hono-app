
import Accordion from "../../../core/components/Accordion.js";
import api from "../../../core/components/Api.js";
import i18n from "../../i18n/langs.js";
import FlywireTable from "../tablas/Flywire.js";

export default class FlywireAccordion extends Accordion {
	static #instance;
	static getInstance = () => FlywireAccordion.#instance;

	connectedCallback() {
		FlywireAccordion.#instance = this;
	}

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

				super.setData(grupos).renderGroup();
				this.show();
			});
		} catch(ex) {
			console.error("Error parsing Flywire JSON data:", ex);
			document.forms.conciliar.elements.fichero.setError("Formato de fichero incorrecto", "No se puede procesar el contenido del fichero Flywire.");
		}
	}

	summary(el, key, status) { el.innerHTML = status.count + ".- " + key; }
	afterTab(tab, rows) {
		const table = new FlywireTable(); // build table dynamically
		tab.lastElementChild.appendChild(table.view(rows)); // append table to details
		tab.firstElementChild.innerHTML += " (" + i18n.isoFloat(table.getProp("importe")) + " €)"; // summary element
	}
}

customElements.define("flywire-table", FlywireTable, { extends: "table" });
