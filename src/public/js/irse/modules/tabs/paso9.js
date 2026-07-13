
import api from "../../../core/components/Api.js";
import tabs from "../../../core/components/tabs/TabsOld.js";
import valid from "../../i18n/validators/irse.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js";
import gastos from "../../model/Gastos.js";

import Cuentas from "../../components/paso9/Cuentas.js";
import Paises from "../../components/paso9/Paises.js";
import Imputacion from "../tables/imputacion.js";
import observer from "../../../core/util/Observer.js";
import form from "../irse.js";

/** Fin + IBAN **/
class Paso9 {
	#imputacion = tabs.$1(9, "table");

	init() {
		tabs.setViewEvent(9, this.#imputacion.render); // always auto build table imputacion
		const fnData = () => {
			const data = form.getData(".ui-paso9");
			data.id = irse.getId(); // solicitud actual
			data.inputacion = this.#imputacion.getData();
			return data;
		}
		tabs.setAction("save9", () => {
			if (valid.paso9()) // ok => send data and show alerts
				api.setJSON(fnData()).json("/uae/iris/paso9/save");
			form.setChanged(); // force user re-change
		});
		tabs.setAction("send", () => {
			if (!valid.paso9() || !i18n.confirm("msgFirmarEnviar")) return;
			api.setJSON(fnData()).json("/uae/iris/paso9/send").then(data => {
				form.setFirmas(data.firmas).setEditable(irse.setProcesando()).refresh(irse); // update form
				form.getSolicitudes().refreshRow(); // try to update row list state (for editing)
				observer.emit("close"); // no parameter needed
				tabs.showInit(); // return to init tab
			});
		});
	}

	setCuentas(cuentas) {
		form.getElement("cuentas").setCuentas(cuentas);
	}
	view(cuentas) {
		form.getElement("cuentas").setCuentas(cuentas);
		form.setValue("observaciones", gastos.getObservaciones()).refresh(irse); // refresh form with new data
	}
}

customElements.define("cuentas-list", Cuentas, { extends: "select" });
customElements.define("paises-list", Paises, { extends: "select" });
customElements.define("table-imputacion", Imputacion, { extends: "table" });

export default  new Paso9();
