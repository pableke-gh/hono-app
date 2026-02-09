
import sb from "../../components/types/StringBox.js";
import api from "../../components/Api.js";
import tabs from "../../components/Tabs.js";
import i18n from "../i18n/langs.js";
import valid from "../i18n/validators.js";

import rg from "../model/ruta/RutaGasto.js";
import rr from "../model/ruta/RutaRead.js"
import gasto from "../model/Gasto.js";

import rutas from "./rutas.js";
import organicas from "./organicas.js";
import form from "../../xeco/modules/solicitud.js";

function IrseTabs() {
	const eTipoGasto = form.getInput("#tipo-gasto"); // select input
	const grupos = form.querySelectorAll(".grupo-gasto"); // toggle groups
	const fnUpload = () => { // merge data to send
		const fd = form.getFormData();
		fd.exclude([ // exclude fields
			"memo", "justifi", "justifiVp", "justifiCong", "tipoSubv", "finalidad", "justifiKm",
			"iban", "cuenta", "swift", "observaciones", "urgente", "fMax", "extra", "rechazo",
			"paisEntidad", "nombreEntidad", "codigoEntidad", "acInteresado", "origen", "destino"
		]);
		api.setFormData(fd).json("/uae/iris/upload/gasto").then(() => form.loading().click("#updateGasto"));
	}

	/*********** FACTURAS, TICKETS y demás DOCUMENTACIÓN para liquidar ***********/
	tabs.setInitEvent("itinerario", () => { // enlace a la tabla de consulta del paso 5
		const _tblReadOnly = form.setTable("#rutas-read", rr.getTable()); // build tabla itinerario
		tabs.setViewEvent("itinerario", () => _tblReadOnly.view(rutas.getAll())); // render rows
	});
	tabs.setInitEvent(5, () => {
		const fnChange = () => {
			const tipo = eTipoGasto.value;
			form.setval("#tipoGasto", tipo).text(".label-text-gasto", i18n.get("lblDescObserv"));
			if (gasto.isTipoPernocta(tipo))
				grupos.mask(0b11011);
			else if (gasto.isTipoDoc(tipo))
				grupos.mask(0b10101);
			else if (gasto.isTipoExtra(tipo))
				grupos.mask(0b10111);
			else if (gasto.isTipoTaxi(tipo)) { //ISU y taxi
				form.text(".label-text-gasto", i18n.get("lblDescTaxi"));
				grupos.mask(0b10111);
			}
			else if (0 < +tipo)
				grupos.mask(0b10011);
			else
				grupos.mask(0b00001);
		}
		eTipoGasto.onchange = fnChange; // Change event
		form.onChangeFile("[name='fileGasto']", (ev, el, file) => { el.nextElementSibling.innerHTML = file.name; fnChange(); });
	});
	this.viewTab5 = () => {
		grupos.mask(0);
		eTipoGasto.value = ""; // clear selection
		if (rutas.isEmpty()) return; // aun no hay rutas => paso 0
		form.setval("#impGasto", 0).setval("#txtGasto").setval("#trayectos")
			.setLimitDateRange("#fAloMin", "#fAloMax", rutas.getHoraSalida(), rutas.getHoraLlegada());
	}
	tabs.setAction("uploadGasto", () => (valid.upload() && fnUpload()));

	this.initTab9 = tab => { // Init tab 9: IBAN
		const cuentas = form.getInput("#cuentas");
		function fnPais(pais) {
			const es = (pais == "ES");
			form.setVisible("#entidades", es).setVisible(".swift-block,#banco", !es);
		}

		form.setVisible("#grupo-iban", cuentas.options.length <= 1) // existen cuentas?
			.onChangeInput("#urgente", ev => form.setVisible(".grp-urgente", ev.target.value == "2"))
			.onChangeInput("#entidades", () => form.setval("#banco", form.getOptionText("#entidades")))
			.onChangeInput("#paises", ev => { fnPais(ev.target.value); form.setval("#banco"); })
			.onChangeInput("#iban", ev => { ev.target.value = sb.toWord(ev.target.value); })
			.onChangeInput("#swift", ev => { ev.target.value = sb.toWord(ev.target.value); });

		cuentas.onchange = () => {
			form.setval("#iban", cuentas.value).setval("#entidades", sb.substr(cuentas.value, 4, 4))
					.setval("#swift").setVisible("#grupo-iban", !cuentas.value);
		}
		cuentas.options.forEach(opt => {
			const entidad = valid.getBanks().getEntidad(opt.innerText);
			if (entidad)
				opt.innerText += " - " + entidad;
		});
		if (!cuentas.value) {
			fnPais(form.valueOf("#paises"));
			tab.querySelector("#grupo-iban").show();
		}

		window.fnPaso9 = () => valid.paso9() && organicas.build() && loading();
		window.fnSend = () => valid.paso9() && i18n.confirm("msgFirmarEnviar") && organicas.build() && loading();
		organicas.build();
	}

	/*********** ASOCIAR RUTAS / GASTOS ***********/
	tabs.setInitEvent(12, () => { // tabla de rutas pendientes
		const _tblRutasGasto = form.setTable("#rutas-out", rg.getTable()); // itinerario
		tabs.setViewEvent(12, () => _tblRutasGasto.render(rutas.getRutasOut()));
		tabs.setAction("rtog", () => {
			const rutas = _tblRutasGasto.getBody().$$(":checked");
			if (!rutas || !rutas.length) // no hay rutas seleccionadas
				return form.showError("errLinkRuta"); // mensaje de error
			form.setval("#trayectos", rutas.map(el => el.value).join()); // PK de las rutas seleccionadas
			fnUpload(); // upload data and click updateGasto button
		});
	});
}

export default new IrseTabs();
