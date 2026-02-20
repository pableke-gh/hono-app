
import Form from "../../../components/forms/Form.js";
import api from "../../../components/Api.js";
import tabs from "../../../components/Tabs.js";
import valid from "../../i18n/validators.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js"
import rutas from "../../model/Rutas.js"
import gasto from "../../model/Gasto.js";

import RutaGasto from "../tables/RutaGasto.js";
import RutaRead from "../tables/RutaRead.js"

/*********** FACTURAS, TICKETS y demás DOCUMENTACIÓN para liquidar ***********/
export default class Paso5 extends Form {
	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init() {
		tabs.setInitEvent(5, this.initTab);
	}

	initTab = () => {
		const eTipoGasto = this.getInput("#tipo-gasto"); // select input
		const grupos = this.querySelectorAll(".grupo-gasto"); // toggle groups
		const fnChange = () => {
			const tipo = eTipoGasto.value;
			this.setval("#tipoGasto", tipo).text(".label-text-gasto", i18n.get("lblDescObserv"));
			if (gasto.isTipoPernocta(tipo))
				grupos.mask(0b11011);
			else if (gasto.isTipoDoc(tipo))
				grupos.mask(0b10101);
			else if (gasto.isTipoExtra(tipo))
				grupos.mask(0b10111);
			else if (gasto.isTipoTaxi(tipo)) { //ISU y taxi
				this.text(".label-text-gasto", i18n.get("lblDescTaxi"));
				grupos.mask(0b10111);
			}
			else if (0 < +tipo)
				grupos.mask(0b10011);
			else
				grupos.mask(0b00001);
		}
		const fnReload = () => {
			grupos.mask(0);
			eTipoGasto.value = ""; // clear selection
			this.setval("#impGasto", 0).setval("#txtGasto").setval("#trayectos");
			return this.setLimitDateRange("#fAloMin", "#fAloMax", rutas.getHoraSalida(), rutas.getHoraLlegada());
		}
		const fnUpload = () => { // merge data to send
			const fd = this.getFormData();
			fd.exclude([ // exclude fields
				"memo", "justifi", "justifiVp", "justifiCong", "tipoSubv", "finalidad", "justifiKm",
				"iban", "cuenta", "swift", "observaciones", "urgente", "fMax", "extra", "rechazo",
				"paisEntidad", "nombreEntidad", "codigoEntidad", "acInteresado", "origen", "destino"
			]);
			api.setFormData(fd).json("/uae/iris/upload/gasto").then(() => this.loading().click("#updateGasto"));
			fnReload().refresh(irse);
		}

		fnReload(); // prepare form view
		eTipoGasto.onchange = fnChange; // Change event
		this.onChangeFile("[name='fileGasto']", (ev, el, file) => { el.nextElementSibling.innerHTML = file.name; fnChange(); });

		tabs.setInitEvent("itinerario", () => { // enlace a la tabla de consulta del paso 5
			const _tblReadOnly = new RutaRead(this.querySelector("#rutas-read")); // build tabla itinerario
			tabs.setViewEvent("itinerario", () => _tblReadOnly.view()); // render rows
		});

		// el paso 5 requiere validaciones en el servidor sin actualizar el html
		tabs.setAction("paso5", () => {
			if (!irse.isEditable()) return tabs.nextTab(); // go next tab directly
			loading(); window.rcPaso5(); // llamo al servidor para sus validaciones
		});
		tabs.setAction("save5", () => { loading(); window.rcSave5(); });
		tabs.setAction("uploadGasto", () => (valid.upload() && fnUpload()));

		/*********** ASOCIAR RUTAS / GASTOS ***********/
		tabs.setInitEvent(12, () => { // tabla de rutas pendientes
			const _tblRutasGasto = new RutaGasto(this.querySelector("#rutas-out")); // itinerario
			tabs.setViewEvent(12, () => _tblRutasGasto.view());
			tabs.setAction("rtog", () => {
				const rutas = _tblRutasGasto.getBody().$$(":checked");
				if (!rutas || !rutas.length) // no hay rutas seleccionadas
					return this.showError("errLinkRuta"); // mensaje de error
				this.setval("#trayectos", rutas.map(el => el.value).join()); // PK de las rutas seleccionadas
				fnUpload(); // upload data and click updateGasto button
			});
		});
	}
}
