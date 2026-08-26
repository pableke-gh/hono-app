
import api from "../../core/components/Api.js";
import Tab from "../../core/components/tabs/Tab.js";
import tabs from "../../core/components/tabs/Tabs.js";
import valid from "../i18n/validators/irse.js";

import irse from "../model/Irse.js";
import rutas from "../model/Rutas.js";

import observer from "../../core/util/Observer.js";
import TipoGasto from "../components/gastos/TipoGasto.js";
import MsgGastos from "../components/gastos/MsgGastos.js";
import tables from "../components/tables/tables.js";
import form from "./irse.js";

/*********** FACTURAS, TICKETS y demás DOCUMENTACIÓN para liquidar ***********/
export default class Paso5 extends Tab {
	getGastos = () => tables.get("gastos");
	getRutasPendientes = () => tables.get("pendientes");

	init() {
		super.init();
		observer.subscribe("fileGasto", input => {
			input.isEmpty() ? this.beforeView() : form.getElement("tipoGasto").update();
		});

		// el paso 5 requiere validaciones en el servidor
		this.addEventListener("change", ev => ev.stopPropagation()); // tab not change form state
		tabs.setAction("save5", () => this.send().then(form.setOk)); // todo: build custom element
		tabs.setAction("uploadGasto", () => (valid.upload() && this.upload())); // todo: build custom element
	}
	beforeView() {
		form.getElement("tipoGasto").reset();
		form.setValue("impGasto", 0).setValue("txtGasto");
		if (rutas.size()) // preload date range for pernoctas
			form.getElement("fAloMin").setLimit("fAloMax", rutas.getHoraSalida(), rutas.getHoraLlegada());
		return super.beforeView();
	}

	updateRutas() {
		this.getRutasPendientes().view(); // force reload rutas pendientes
	}
	view() {
		this.getGastos().render(); // table gastos
		this.updateRutas(); // tebles rutas
	}

	upload(rutas) { // merge data to send
		const fd = form.getFormData(".ui-gasto").set("id", irse.getId()).set("trayectos", rutas); // set id + etapas
		api.setFormData(fd).json("/uae/iris/upload/gasto").then(data => observer.emit("link", data.gasto)); // send data
		this.beforeView();
	}

	send() { return api.init().json("/uae/iris/paso5/save?id=" + irse.getId()); }
	prev1() {
		const tab = form.getPerfil().isMaps() ? 2 : 1;
		super.show(irse.isIsu() ? 3 : tab);
	}
	next1() {
		if (!irse.isEditable())
			return super.next1(); // go next tab directly
		this.send().then(() => super.next1()); // validaciones del servidor
	}
}

customElements.define("tipo-gasto", TipoGasto, { extends: "select" });
customElements.define("msg-gastos", MsgGastos, { extends: "p" });
