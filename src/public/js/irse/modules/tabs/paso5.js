
import FormBase from "../../../components/forms/FormBase.js";
import api from "../../../components/Api.js";
import tabs from "../../../components/Tabs.js";
import valid from "../../i18n/validators/irse.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js"
import rutas from "../../model/Rutas.js"
import gasto from "../../model/Gasto.js";
import gastos from "../../model/Gastos.js";

import RutaPendientes from "../tables/pendientes.js";
import RutaConsulta from "../tables/itinerario.js"
import TableGastos from "../tables/gastos.js"
import Observer from "../../util/Observer.js";

/*********** FACTURAS, TICKETS y demás DOCUMENTACIÓN para liquidar ***********/
export default class Paso5 extends FormBase {
	#tipoGasto = this.getElement("tipoGasto"); // select input
	#grupos = this.querySelectorAll(".grupo-gasto"); // toggle groups

	#tg = new TableGastos(this);
	#pendientes = new RutaPendientes(this);

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init() {
		this.#tg.init(); // 1º en observar
		this.#pendientes.init(); // 2º en observar
		tabs.setInitEvent(5, this.initTab).setViewEvent(5, this.#reload);
	}

	#reload = () => {
		this.#grupos.mask(0);
		this.#tipoGasto.value = ""; // clear selection
		this.setValue("impGasto", 0).setValue("txtGasto");
		this.getElement("fAloMin").setLimit("fAloMax", rutas.getHoraSalida(), rutas.getHoraLlegada());
	}
	initTab = () => {
		const fnChange = () => {
			const tipo = this.#tipoGasto.value;
			this.text(".label-text-gasto", i18n.get("lblDescObserv"));
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
		this.getElement("fileGasto").onFile((ev, el, file) => { el.nextElementSibling.innerHTML = file.name; fnChange(); });
		tabs.setInitEvent("itinerario", () => { // enlace a la tabla de consulta del paso 5
			const _tblReadOnly = new RutaConsulta(this.querySelector("#rutas-read")); // build tabla itinerario
			tabs.setViewEvent("itinerario", () => _tblReadOnly.view()); // render rows
		});

		// el paso 5 requiere validaciones en el servidor
		const fnUrl = () => ("/uae/iris/paso5/save?id=" + irse.getId());
		tabs.setAction("paso5", () => {
			if (!irse.isEditable()) return tabs.nextTab(); // go next tab directly
			api.init().json(fnUrl()).then(() => tabs.goTab(6)); // validaciones del servidor
		});
		tabs.setAction("save5", () => api.init().json(fnUrl()).then(this.setOk));
		tabs.setAction("uploadGasto", () => (valid.upload() && this.upload()));
	}

	updateRutas() {
		this.#pendientes.view(); // force reload rutas pendientes
	}
	view(data) {
		gastos.setGastos(data); // load array
		this.#tg.render(); // table gastos
		this.updateRutas(); // tebles rutas
	}

	upload(rutas) { // merge data to send
		const fd = this.getFormDataInputs(".ui-gasto").set("id", irse.getId()).set("trayectos", rutas); // set id + etapas
		api.setFormData(fd).json("/uae/iris/upload/gasto").then(data => Observer.emit("link", data.gasto)); // send data
		this.#reload();
	}
}
