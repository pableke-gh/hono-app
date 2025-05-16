
import tabs from "../../components/Tabs.js";
import dt from "../../components/types/DateBox.js";
import i18n from "../i18n/langs.js";

import iris from "../model/Iris.js";
import rutas from "../model/ruta/Rutas.js";
import gastos from "../model/gasto/Gastos.js"; 

import perfil from "./perfil/perfil.js";
import gm from "./gastos/gastos.js";
import xeco from "../../xeco/xeco.js";

function Otri() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
	const _eCongreso = form.getInput("#congreso"); //congreso si/no
	const _eF1Cong = form.getInput("#f1Cong"); //fecha inicio del congreso
	const _eF2Cong = form.getInput("#f2Cong"); //fecha fin del congreso

	const fnCongreso = () => (+_eCongreso.value > 0);
	const isCongresoJustifi = () => {
		if (!fnCongreso() || !_eF1Cong.value || !_eF2Cong.value)
			return false; // no se justifica el congreso
		const fIniCong = dt.toDate(_eF1Cong.value); // fecha inicio del congreso
		const fFinCong = dt.toDate(_eF2Cong.value); // fecha fin del congreso
		dt.addDays(fIniCong, -1).trunc(fIniCong).addDays(fFinCong, 2).trunc(fFinCong);
		return dt.lt(rutas.salida(), fIniCong) || dt.lt(fFinCong, rutas.llegada());
	}

	const fnSave = data => {
		if (form.isChanged())
			gm.setSubvencion(data).setCongreso(data).save();
		return true;
	}
	this.validate = data => {
		const valid = i18n.getValidators();
		valid.size("justifi", data.justifi, "errJustifiSubv");
		if (form.fire("is-rutas-vp")) // debe justificar el uso del vp
			valid.size("justifiVp", data.justifiVp, "errJustifiVp");
		if (fnCongreso()) { // validaciones para el congreso
			valid.gt0("impInsc", data.impInsc); // importe inscripcion
			_eF1Cong.value || valid.isDate("f1Cong", data.f1Cong);
			_eF2Cong.value || valid.isDate("f2Cong", data.f2Cong);
		}
		if (isCongresoJustifi())
			valid.size("justifiCong", data.justifiCong, "errCongreso");
		return valid.isOk() && fnSave(data);
	}

	/*********** subvención, congreso, asistencias/colaboraciones ***********/
	tabs.setAction("paso3", () => { form.validate(self.validate) && form.sendTab(window.rcPaso3); });
	tabs.setAction("save3", () => { form.validate(self.validate) && form.sendTab(window.rcSave3, 3); });
	tabs.setActiveEvent("isu", perfil.isIsu);

	this.init = () => {
		const fnRefresh = () => form.refresh(iris);
		form.set("is-congreso", fnCongreso).set("is-congreso-justifi", isCongresoJustifi);
		form.setDateRange("#fIniCong", "#fFinCong", fnRefresh); // refresh view congreso
		_eCongreso.onchange = fnRefresh;
	}

	this.view = () => {
		iris.set("justifi", gastos.getJustifi()).set("tipoSubv", gastos.getTipoSubv()).set("finalidad", gastos.getFinalidad()).set("vinc", gastos.getVinc()) // gasto subv.
			.set("tipoCongreso", gastos.getTipoCongreso()).set("impInsc", gastos.getImpInsc()).set("f1Cong", gastos.getF1Cong()).set("f2Cong", gastos.getF2Cong()).set("justifiCong", gastos.getJustifiCong()) // gasto congreso
			.set("justifiVp", gastos.getJustifiVp()); // gasto asistencia / colaboraciones
	}
}

export default new Otri();
