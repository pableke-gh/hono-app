
import api from "../../core/components/Api.js";
import tabs from "../../core/components/tabs/TabsOld.js";

import irse from "../model/Irse.js";
import gastos from "../model/Gastos.js";

import Cuentas from "../components/paso9/Cuentas.js";
import Paises from "../components/paso9/Paises.js";
import PrevPaso9 from "../components/paso9/PrevPaso9.js";
import SavePaso9 from "../components/paso9/SavePaso9.js";
import SendPaso9 from "../components/paso9/SendPaso9.js";
import tables from "../components/tables/tables.js";
import form from "./irse.js";

/** Fin + IBAN **/
class Paso9 {
	getImputacion = () => tables.get("imputacion");

	init() {
		tabs.setViewEvent(9, this.getImputacion().render); // always auto build table imputacion
	}

	setCuentas(cuentas) {
		form.getElement("cuentas").setCuentas(cuentas);
	}
	view(cuentas) {
		form.getElement("cuentas").setCuentas(cuentas);
		form.setValue("observaciones", gastos.getObservaciones()).refresh(irse); // refresh form with new data
	}
	save(url) {
		const data = form.getData(".ui-paso9");
		data.id = irse.getId(); // solicitud actual
		data.inputacion = this.getImputacion().getData();
		return api.setJSON(data).json(url).then(() => form.setChanged(false));
	}
}

customElements.define("cuentas-list", Cuentas, { extends: "select" });
customElements.define("paises-list", Paises, { extends: "select" });
customElements.define("prev-paso9", PrevPaso9, { extends: "button" });
customElements.define("save-paso9", SavePaso9, { extends: "button" });
customElements.define("send-paso9", SendPaso9, { extends: "button" });

export default  new Paso9();
