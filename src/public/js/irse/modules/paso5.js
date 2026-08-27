
import api from "../../core/components/Api.js";
import Tab from "../../core/components/tabs/Tab.js";

import irse from "../model/Irse.js";
import rutas from "../model/Rutas.js";

import observer from "../../core/util/Observer.js";
import TipoGasto from "../components/gastos/TipoGasto.js";
import Upload from "../components/gastos/Upload.js";
import MsgGastos from "../components/gastos/MsgGastos.js";
import Save from "../components/gastos/Save.js";
import tables from "../components/tables/tables.js";
import form from "./irse.js";

/*********** FACTURAS, TICKETS y demás DOCUMENTACIÓN para liquidar ***********/
export default class Paso5 extends Tab {
	getGastos = () => tables.get("gastos");
	getRutasPendientes = () => tables.get("pendientes");

	init() {
		super.init(); // el paso 5 requiere validaciones en el servidor
		this.addEventListener("change", ev => ev.stopPropagation()); // tab not change form state
		observer.subscribe("fileGasto", input => {
			input.isEmpty() ? this.beforeView() : form.getElement("tipoGasto").update();
		});
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

	send() {
		return api.init().json("/uae/iris/paso5/save?id=" + irse.getId());
	}
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
customElements.define("upload-gasto", Upload, { extends: "button" });
customElements.define("msg-gastos", MsgGastos, { extends: "p" });
customElements.define("save-gasto", Save, { extends: "button" });
