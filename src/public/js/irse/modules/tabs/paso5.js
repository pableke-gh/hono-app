
import api from "../../../components/Api.js";
import tabs from "../../../components/Tabs.js";
import valid from "../../i18n/validators/irse.js";

import irse from "../../model/Irse.js";
import rutas from "../../model/Rutas.js";

import TipoGasto from "../../components/gastos/TipoGasto.js";
import RutaPendientes from "../tables/pendientes.js";
import RutaConsulta from "../tables/itinerario.js";
import TableGastos from "../tables/gastos.js";
import observer from "../../../core/util/Observer.js";
import form from "../irse.js";

/*********** FACTURAS, TICKETS y demás DOCUMENTACIÓN para liquidar ***********/
class Paso5 {
	#tGastos = tabs.$1(5, "#gastos"); // table gastos
	#pendientes = tabs.$1(12, "#rutas-out"); // paso 12

	#reload = () => {
		form.getElement("tipoGasto").reset();
		form.setValue("impGasto", 0).setValue("txtGasto");
		if (rutas.size()) // preload date range for pernoctas
			form.getElement("fAloMin").setLimit("fAloMax", rutas.getHoraSalida(), rutas.getHoraLlegada());
	}
	init() {
		this.#tGastos.init(); // 1º en observar
		this.#pendientes.init(); // 2º en observar
		tabs.setViewEvent(5, this.#reload);
		observer.subscribe("fileGasto", input => { input.isEmpty() ? this.#reload() : form.getElement("tipoGasto").update(); });

		// el paso 5 requiere validaciones en el servidor
		const fnSend = () => api.init().json("/uae/iris/paso5/save?id=" + irse.getId());
		tabs.getTab(5).addEventListener("change", ev => ev.stopPropagation()); // tab not change form state
		tabs.setAction("paso5", () => {
			if (!irse.isEditable()) return tabs.next(); // go next tab directly
			fnSend().then(() => tabs.goTo(6)); // validaciones del servidor
		});
		tabs.setAction("save5", () => fnSend().then(form.setOk));
		tabs.setAction("uploadGasto", () => (valid.upload() && this.upload()));
	}

	updateRutas() {
		this.#pendientes.view(); // force reload rutas pendientes
	}
	view() {
		this.#tGastos.render(); // table gastos
		this.updateRutas(); // tebles rutas
	}

	upload(rutas) { // merge data to send
		const fd = form.getFormData(".ui-gasto").set("id", irse.getId()).set("trayectos", rutas); // set id + etapas
		api.setFormData(fd).json("/uae/iris/upload/gasto").then(data => observer.emit("link", data.gasto)); // send data
		this.#reload();
	}
}

customElements.define("tipo-gasto", TipoGasto, { extends: "select" });
customElements.define("table-itinerario", RutaConsulta, { extends: "table" });
customElements.define("table-pendientes", RutaPendientes, { extends: "table" });
customElements.define("table-gastos", TableGastos, { extends: "table" });

export default new Paso5();
