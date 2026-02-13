
import Table from "../../../components/Table.js";
import valid from "../../i18n/validators.js";

import iris from "../../model/Iris.js";
import transporte from "../../model/gasto/Transporte.js";
import gastos from "../../model/gasto/Gastos.js";
import form from "../iris.js";

class Transportes extends Table {
	constructor() {
		super(form.querySelector("#transportes"), transporte.getTable());
	}

	getImporte = () => this.getProp("imp1");
	setTransportes = () => this.render(gastos.getTransporte());
	validate = data => valid.gt0("impGasto", data.impGasto).close(data);

	init = () => {
		iris.getImpTrasportes = this.getImporte;
		form.set("is-transportes", this.size);
	}
}

export default new Transportes();
