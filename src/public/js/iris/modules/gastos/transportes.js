
import i18n from "../../i18n/langs.js";
import iris from "../../model/Iris.js";
import transporte from "../../model/gasto/Transporte.js";
import gastos from "../../model/gasto/Gastos.js";
import xeco from "../../../xeco/xeco.js";

function Transportes() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
	const _tblTransporte = form.setTable("#transportes", transporte.getTable());

	this.getImporte = () => _tblTransporte.getProp("imp1");

	this.validate = data => {
		const valid = i18n.getValidation();
		valid.gt0("impGasto", data.impGasto);
		return valid.isOk();
	}

	this.setTransportes = () => {
		_tblTransporte.render(gastos.getTransporte());
	}

	this.init = () => {
		//_tblTransporte = form.setTable("#transportes", transporte.getTable());
		iris.getImpTrasportes = self.getImporte;
		form.set("is-transportes", _tblTransporte.size);
	}
}

export default new Transportes();
