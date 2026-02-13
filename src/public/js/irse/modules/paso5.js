
import Form from "./form.js";
import api from "../../components/Api.js";
import tabs from "../../components/Tabs.js";
import valid from "../i18n/validators.js";
import i18n from "../i18n/langs.js";

import irse from "../model/Irse.js"
import RutaGasto from "./tables/RutaGasto.js";
import RutaRead from "./tables/RutaRead.js"
import gasto from "../model/Gasto.js";

import rutas from "./rutas.js";

class Paso5 extends Form {
	#eTipoGasto = this.getInput("#tipo-gasto"); // select input
	#grupos = this.querySelectorAll(".grupo-gasto"); // toggle groups

	constructor() {
		super(); // call super before to use this reference

		const fnUpload = () => { // merge data to send
			const fd = this.getFormData();
			fd.exclude([ // exclude fields
				"memo", "justifi", "justifiVp", "justifiCong", "tipoSubv", "finalidad", "justifiKm",
				"iban", "cuenta", "swift", "observaciones", "urgente", "fMax", "extra", "rechazo",
				"paisEntidad", "nombreEntidad", "codigoEntidad", "acInteresado", "origen", "destino"
			]);
			api.setFormData(fd).json("/uae/iris/upload/gasto").then(() => this.loading().click("#updateGasto"));
		}
	
		/*********** FACTURAS, TICKETS y demás DOCUMENTACIÓN para liquidar ***********/
		tabs.setInitEvent("itinerario", () => { // enlace a la tabla de consulta del paso 5
			const _tblReadOnly = new RutaRead(this.querySelector("#rutas-read")); // build tabla itinerario
			tabs.setViewEvent("itinerario", () => _tblReadOnly.view(rutas.getAll())); // render rows
		});
		tabs.setInitEvent(5, () => {
			const fnChange = () => {
				const tipo = this.#eTipoGasto.value;
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
			this.#eTipoGasto.onchange = fnChange; // Change event
			this.onChangeFile("[name='fileGasto']", (ev, el, file) => { el.nextElementSibling.innerHTML = file.name; fnChange(); });
		});

		tabs.setAction("uploadGasto", () => (valid.upload() && fnUpload()));

		tabs.setAction("paso5", () => {
			if (!valid.paso1(rutas)) return; // if error => stop
			if (!irse.isEditable() || !this.isChanged())
				return tabs.nextTab(); // go next tab directly
			fnSave(); window.rcPaso1(); // call server paso1
		});
		tabs.setAction("save5", () => {
			if (!valid.paso1(rutas)) return; // if error => stop
			if (!this.isChanged()) return this.setOk(); // nada que guardar
			fnSave(); window.rcSave1(); // call server paso1
		});

		/*********** ASOCIAR RUTAS / GASTOS ***********/
		tabs.setInitEvent(12, () => { // tabla de rutas pendientes
			const _tblRutasGasto = new RutaGasto(this.querySelector("#rutas-out")); // itinerario
			tabs.setViewEvent(12, () => _tblRutasGasto.render(rutas.getRutasOut()));
			tabs.setAction("rtog", () => {
				const rutas = _tblRutasGasto.getBody().$$(":checked");
				if (!rutas || !rutas.length) // no hay rutas seleccionadas
					return this.showError("errLinkRuta"); // mensaje de error
				this.setval("#trayectos", rutas.map(el => el.value).join()); // PK de las rutas seleccionadas
				fnUpload(); // upload data and click updateGasto button
			});
		});
	}

	view = () => {
		this.#grupos.mask(0);
		this.#eTipoGasto.value = ""; // clear selection
		if (rutas.isEmpty()) return; // aun no hay rutas => paso 0
		this.setval("#impGasto", 0).setval("#txtGasto").setval("#trayectos")
			.setLimitDateRange("#fAloMin", "#fAloMax", rutas.getHoraSalida(), rutas.getHoraLlegada());
	}
}

export default new Paso5();
