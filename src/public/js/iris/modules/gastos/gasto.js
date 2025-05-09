
import tabs from "../../../components/Tabs.js";
import pf from "../../../components/Primefaces.js";
import i18n from "../../i18n/langs.js";

import iris from "../../model/Iris.js";
import rutas from "../../model/ruta/Rutas.js";

import pernoctas from "./pernoctas.js";
import xeco from "../../../xeco/xeco.js";

function Gasto() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
	const _eTipoGasto = form.getInput("#tipo-gasto");
	const _grpGasto = form.querySelectorAll(".grupo-gasto");

	const isInterurbano = () => (_eTipoGasto.value == "8"); //trayectos interurbanos
	const isTaxi = () => (_eTipoGasto.value == "4"); //ISU y taxi
	const fnPernocta = val => (val == "9"); // valor == tipo pernocta
	const isPernocta = () => fnPernocta(_eTipoGasto.value); // campo == tipo pernocta 
	const isDoc = () => ["201", "202", "204", "205", "206"].includes(_eTipoGasto.value);
	const isExtra = () => ["301", "302", "303", "304"].includes(_eTipoGasto.value);
	const fnChange = () => {
		if (isPernocta())
			_grpGasto.mask(0b11011);
		else if (isDoc())
			_grpGasto.mask(0b10101);
		else if (isExtra())
			_grpGasto.mask(0b10111);
		else if (isTaxi()) //ISU y taxi
			_grpGasto.mask(0b10111);
		else if (0 < +_eTipoGasto.value) // ticket
			_grpGasto.mask(0b10011);
		else
			_grpGasto.mask(0b00001);
		form.refresh(iris);
	}

	this.reset = () => {
		_grpGasto.mask(0);
		_eTipoGasto.value = "";
		const start = rutas.getHoraSalida();
		const end = rutas.getHoraLlegada();
		form.setval("#impGasto", 0).setval("#txtGasto").setval("#trayectos")
			.setval("#fMinGasto", start).setAttr("#fMinGasto", "min", start.substring(0, 10))
			.setval("#fMaxGasto", end).setAttr("#fMaxGasto", "max", end.substring(0, 10))
			.text(".filename", "").refresh(iris);
	}

	this.validate = data => {
		console.log(data);
		// validación del tipo de gasto
		const valid = form.getValidators();
		if (isDoc()) {
			valid.addRequired("txtGasto", "errDoc");
			return valid.isOk();
		}
		//valid.gt0("impGasto", data.impGasto);
		if (fnPernocta(data.tipoGasto))
			return pernoctas.validate(data);
		// todo: validate campos grupo-gastos
		return valid.isOk();
	}

	this.init = () => {
		_eTipoGasto.onchange = fnChange; // Change event
		pf.uploads(form.querySelectorAll(".pf-upload-gasto"), fnChange);
		iris.getTextGasto = () => i18n.get(isTaxi() ? "lblDescTaxi" : "lblDescObserv"); // label text
		form.setDateRange("#fMinGasto", "#fMaxGasto"); // date range
	}

	tabs.setViewEvent(5, self.reset); // reset form on view tab 5
	tabs.setAction("uploadGasto", () => {
		if (!form.validate(self.validate))
			return false; // Errores al validar los gastos
		if (isInterurbano()) // trayectos interurbanos
			tabs.showTab(12); // tabla de rutas pendientes
		else
			form.sendTab(window.rcUploadGasto);
	});
}

export default new Gasto();
