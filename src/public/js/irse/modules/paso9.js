
import api from "../../core/components/Api.js";
import Tab from "../../core/components/tabs/Tab.js";
import valid from "../i18n/validators/irse.js";

import irse from "../model/Irse.js";
import gastos from "../model/Gastos.js";

import Cuentas from "../components/paso9/Cuentas.js";
import Paises from "../components/paso9/Paises.js";
import SavePaso9 from "../components/paso9/SavePaso9.js";
import SendPaso9 from "../components/paso9/SendPaso9.js";
import tables from "../components/tables/tables.js";
import form from "./irse.js";

/** Fin + IBAN **/
export default class Paso9 extends Tab {
	getImputacion = () => tables.get("imputacion");

	beforeView() { this.getImputacion().render(); return super.beforeView(); } // always auto build table imputacion
	afterView() { form.getElement("cuentas").focus(); } // focus on first input

	setCuentas(cuentas) {
		form.getElement("cuentas").setCuentas(cuentas);
	}
	view(cuentas) {
		form.getElement("cuentas").setCuentas(cuentas);
		form.setValue("observaciones", gastos.getObservaciones()).refresh(irse); // refresh form with new data
	}

	send(url) {
		const data = form.setChanged().getData(".ui-paso9");
		data.id = irse.getId(); // id de la solicitud actual
		data.inputacion = this.getImputacion().getData();
		return api.setJSON(data).json(url);
	}
	prev1() {
		if (valid.paso9() && irse.isEditable() && form.isChanged()) // is valid change
			this.send("/uae/iris/paso9/save"); // send data to server and go back
		else // reset change flag to avoid unnecessary saves
			form.setChanged(false);
		super.prev1(); // go back tab
	}
}

customElements.define("cuentas-list", Cuentas, { extends: "select" });
customElements.define("paises-list", Paises, { extends: "select" });
customElements.define("save-paso9", SavePaso9, { extends: "button" });
customElements.define("send-paso9", SendPaso9, { extends: "button" });
