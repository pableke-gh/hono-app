
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";
import dt from "../../components/types/DateBox.js";
import i18n from "../i18n/langs.js";

import iris from "../model/Iris.js";
import rutas from "../model/ruta/Rutas.js";
import gastos from "../model/gasto/Gastos.js"; 

import actividad from "./perfil/actividad.js";
import form from "../../xeco/modules/SolicitudForm.js";

function Otri() {
	//const self = this; //self instance
	const _eCongreso = form.getInput("#congreso"); //congreso si/no
	const _eF1Cong = form.getInput("#f1Cong"); //fecha inicio del congreso
	const _eF2Cong = form.getInput("#f2Cong"); //fecha fin del congreso

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

	const fnCongreso = () => (+_eCongreso.value > 0);
	const isCongresoJustifi = () => {
		if (!fnCongreso() || !_eF1Cong.value || !_eF2Cong.value)
			return false; // no se justifica el congreso
		const fIniCong = dt.trunc(dt.addDays(dt.toDate(_eF1Cong.value), -1)); // fecha inicio del congreso
		const fFinCong = dt.trunc(dt.addDays(dt.toDate(_eF2Cong.value), 2)); // fecha fin del congreso
		return dt.lt(rutas.salida(), fIniCong) || dt.lt(fFinCong, rutas.llegada());
	}

	const fnValidate = data => {
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
		return valid.isOk();
	}
	const fnPasoIsu = tab => {
		const data = form.validate(fnValidate);
		if (!data) // valido el formulario
			return false; // error => no hago nada
		if (!form.isChanged()) // compruebo cambios
			return form.nextTab(tab); // no cambios => salto al siguiente paso
		const temp = Object.assign(iris.getData(), data); // merge data to send
		temp.gastos = gastos.setSubvencion(data).setCongreso(data).getGastos();
		api.setJSON(temp).json("/uae/iris/save").then(data => form.update(data, tab));
	}

	/*********** subvención, congreso, asistencias/colaboraciones ***********/
	tabs.setAction("paso3", () => fnPasoIsu());
	tabs.setAction("save3", () => fnPasoIsu("isu"));
	tabs.setActiveEvent("isu", actividad.isIsu);
}

export default new Otri();
