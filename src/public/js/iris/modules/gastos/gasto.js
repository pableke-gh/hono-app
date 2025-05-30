
import tabs from "../../../components/Tabs.js";
import i18n from "../../i18n/langs.js";

import iris from "../../model/Iris.js";
import rutas from "../../model/ruta/Rutas.js";

import transportes from "./transportes.js";
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
	}

	this.reset = () => {
		_grpGasto.mask(0);
		_eTipoGasto.value = "";
		const start = rutas.getHoraSalida();
		const end = rutas.getHoraLlegada();
		form.setval("#impGasto", 0).setval("#txtGasto").setval("#trayectos")
			.setval("#fMinGasto", start).setAttr("#fMinGasto", "min", start.substring(0, 10))
			.setval("#fMaxGasto", end).setAttr("#fMaxGasto", "max", end.substring(0, 10))
			.setChanged().refresh(iris);
	}

	// validación del tipo de gasto
	this.validate = data => {
		const valid = form.getValidators();
		if (isDoc()) // doc only
			return valid.addRequired("txtGasto", "errDoc").isOk();
		if (isExtra() || isTaxi()) // extra info (paso 8) o ISU+taxi
			return valid.addRequired("txtGasto", "errDoc").gt0("impGasto", data.impGasto).isOk();
		if (isInterurbano(data.tipoGasto))
			return transportes.validate(data);
		if (fnPernocta(data.tipoGasto))
			return pernoctas.validate(data);
		return valid.isOk();
	}

	this.init = () => {
		_eTipoGasto.onchange = fnChange; // Change event
		iris.getTextGasto = () => i18n.get(isTaxi() ? "lblDescTaxi" : "lblDescObserv"); // label text
		// set date range type inputs + upload gasto handler on change event
		form.setDateRange("#fMinGasto", "#fMaxGasto").set("upload-gasto", fnChange);
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
