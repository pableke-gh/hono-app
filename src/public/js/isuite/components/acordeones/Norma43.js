
import sb from "../../../components/types/StringBox.js";
import api from "../../../core/components/Api.js";
import i18n from "../../i18n/langs.js";
import Accordion from "../../../core/components/Accordion.js";
import Norma43Table from "../tablas/Norma43.js";
import rb from "../../lib/RecibosBancarios.js";

export default class Norma43Accordion extends Accordion {
	static #instance;
	static getInstance = () => Norma43Accordion.#instance;

	connectedCallback() {
		Norma43Accordion.#instance = this;
	}

	hide() {
		super.hide();
		this.previousElementSibling.classList.add("hide"); // ul
		this.previousElementSibling.previousElementSibling.classList.add("hide"); // h3
	}
	showBack() {
		this.nextElementSibling.nextElementSibling.nextElementSibling.showBack(); // norma57-accordion
	}
	show() {
		super.show();
		this.showBack();
		this.previousElementSibling.classList.remove("hide"); // ul
		this.previousElementSibling.previousElementSibling.classList.remove("hide"); // h3
	}

	setData(contents) {
		const n43 = rb.reset().n43Parse(contents);
		n43.referencias = rb.references().join(); // referencias leidas del fichero bancario
		const temp1 = n43.data.filter(rb.isConciliable); // filas conciliables
		const aux = Object.copy({}, n43, [ "tipo", "ccc", "fInicio", "fFin", "referencias" ]);
		api.setJSON(aux).json("/uae/ttpp/load").then(data => { // llamada post
			const temp2 = data.recibos.filter(recibo => {
				const fila = temp1.find(f => (recibo.refreb == f.ref1));
				fila && rb.acLoad(fila, recibo); //añado los datos de academico
				if (!recibo.fCobro || ([18, 31].indexOf(recibo.pago) < 0))
					return false; //recibo no de TPV
				//primero ajusto el offset time zone (-1 o -2 horas) y luego sumo 1 dia
				//recibo.fCobro.addHours(fCobro.getTimezoneOffset() / 60).addDate(1); //ajusto la hora de AC
				recibo.fCobro = new Date(recibo.fCobro); // build date object
				if (recibo.fCobro.trunc().getDay() == 5) recibo.fCobro.addDate(3); //si es viernes paso a lunes
				else if (recibo.fCobro.getDay() == 6) recibo.fCobro.addDate(2); //si es sabado paso a lunes
				else recibo.fCobro.addDate(1); //de domingo a jueves sumo 1 dia
				if (!recibo.fCobro.between(n43.fInicio, n43.fFin))
					return false; //recibo fuera del rango de fechas del fichero
				recibo.codigo = "22"; //codigo por defecto
				recibo.ref1 = recibo.refreb; // rename referencia
				recibo.forma = "TPV Virtual"; // forma cobro
				recibo.fOperacion = recibo.fCobro; //guardo la fecha de operacion en el recibo
				n43.incorporado += recibo.importe; //importe incorporado de AC
				return rb.normalize(recibo); //incorporo el recibo
			});
			n43.importe = n43.total + n43.incorporado; // importe recibos cancarios + incorporados

			// 1. agrupo todos los recibos del fichero por forma / aplicacion presupuestaria
			super.setData(Object.nestGroupBy(temp1.concat(temp2), [ "forma", "aplicacion" ])).renderTree();

			delete n43.referencias;
			this.previousElementSibling.render(n43);
			document.forms.conciliar.elements.save.show();
			this.show();
		});
	}

	headerGroup(key, status) { this.insertAdjacentHTML("beforeend", `<h4>${key}</h4><hr/>`); }
	summary(el, key, status) { el.innerHTML = status.count + ".- " + key; }
	afterTab(tab, rows) {
		const table = new Norma43Table(); // build table dynamically
		tab.lastElementChild.appendChild(table.view(rows)); // append table to details
		tab.firstElementChild.innerHTML += sb.prefix(rows[0].desc, " - ") + " (" + i18n.isoFloat(table.getProp("importe")) + " €)"; // summary element
	}
}

customElements.define("norma43-table", Norma43Table, { extends: "table" });
