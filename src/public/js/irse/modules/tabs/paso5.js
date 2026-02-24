
import Form from "../../../components/forms/Form.js";
import api from "../../../components/Api.js";
import tabs from "../../../components/Tabs.js";
import valid from "../../i18n/validators.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js"
import rutas from "../../model/Rutas.js"
import gasto from "../../model/Gasto.js";
import gastos from "../../model/Gastos.js";

import RutaGasto from "../tables/RutaGasto.js";
import RutaRead from "../tables/RutaRead.js"
import TableGastos from "../tables/gastos.js"
import Observer from "../util/Observer.js";

/*********** FACTURAS, TICKETS y demás DOCUMENTACIÓN para liquidar ***********/
export default class Paso5 extends Form {
	#tipoGasto = this.getInput("#tipo-gasto"); // select input
	#grupos = this.querySelectorAll(".grupo-gasto"); // toggle groups
	#tg = new TableGastos(this);
	#trg = new RutaGasto(this);

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init() {
		this.#tg.init(); // 1º en observar
		this.#trg.init(); // 2º en observar
		tabs.setInitEvent(5, this.initTab).setViewEvent(5, this.#reload);
	}

	#reload = () => {
		this.#grupos.mask(0);
		this.#tipoGasto.value = ""; // clear selection
		this.setval("#impGasto", 0).setval("#txtGasto");
		this.setLimitDateRange("#fAloMin", "#fAloMax", rutas.getHoraSalida(), rutas.getHoraLlegada());
	}
	initTab = () => {
		const fnChange = () => {
			const tipo = this.#tipoGasto.value;
			this.setval("#tipoGasto", tipo).text(".label-text-gasto", i18n.get("lblDescObserv"));
			if (gasto.isTipoPernocta(tipo))
				this.#grupos.mask(0b11011);
			else if (gasto.isTipoDoc(tipo))
				this.#grupos.mask(0b10101);
			else if (gasto.isTipoExtra(tipo))
				this.#grupos.mask(0b10111);
			else if (gasto.isTipoTaxi(tipo)) { //ISU y taxi
				this.text(".label-text-gasto", i18n.get("lblDescTaxi"));
				this.#grupos.mask(0b10111);
			}
			else if (0 < +tipo)
				this.#grupos.mask(0b10011);
			else
				this.#grupos.mask(0b00001);
		}

		this.#tipoGasto.onchange = fnChange; // Change event
		this.onChangeFile("[name='fileGasto']", (ev, el, file) => { el.nextElementSibling.innerHTML = file.name; fnChange(); });
		tabs.setInitEvent("itinerario", () => { // enlace a la tabla de consulta del paso 5
			const _tblReadOnly = new RutaRead(this.querySelector("#rutas-read")); // build tabla itinerario
			tabs.setViewEvent("itinerario", () => _tblReadOnly.view()); // render rows
		});

		// el paso 5 requiere validaciones en el servidor
		tabs.setAction("paso5", () => {
			if (!irse.isEditable()) return tabs.nextTab(); // go next tab directly
			loading(); window.rcPaso5(); // llamo al servidor para sus validaciones
		});
		tabs.setAction("save5", () => { loading(); window.rcSave5(); });
		tabs.setAction("uploadGasto", () => (valid.upload() && this.upload()));
	}

	view(data) {
		gastos.setGastos(data); // load array
		this.#tg.render(); // table gastos
		this.#trg.view(); // force reload of rutas pendientes
	}

	upload(rutas) { // merge data to send
		const fd = this.getFormData();
		fd.exclude([ // exclude fields
			"memo", "justifi", "justifiVp", "justifiCong", "tipoSubv", "finalidad", "justifiKm",
			"iban", "cuenta", "swift", "observaciones", "urgente", "fMax", "extra", "rechazo",
			"paisEntidad", "nombreEntidad", "codigoEntidad", "acInteresado", "origen", "destino"
		]);
		fd.append("trayectos", rutas); // add etapas to form data
		api.setFormData(fd).json("/uae/iris/upload/gasto").then(data => Observer.emit("link", data.gasto));
		this.#reload();
	}
}
