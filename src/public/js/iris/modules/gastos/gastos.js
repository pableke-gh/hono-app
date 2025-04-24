
import coll from "../../../components/CollectionHTML.js";
import pf from "../../../components/Primefaces.js";
import tabs from "../../../components/Tabs.js";
import i18n from "../../i18n/langs.js";

import iris from "../../model/Iris.js";
import gasto from "../../model/gasto/Gasto.js";
import gastos from "../../model/gasto/Gastos.js";
import rutas from "../../model/ruta/Rutas.js";

import perfil from "../perfil/perfil.js"; 
import pernoctas from "./pernoctas.js";
import resumen from "../resumen.js";

import rmaps from "../rutas/rutasMaps.js";
import rgastos from "../rutas/rutasGasto.js"; 
import xeco from "../../../xeco/xeco.js";

function Gastos() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
	const _eTipoGasto = form.getInput("#tipo-gasto");
	const _grpGasto = form.querySelectorAll(".grupo-gasto");
	let _tblGastos; // container

	const isTaxi = () => (_eTipoGasto.value == "4"); //ISU y taxi
	const isPernocta = () => (_eTipoGasto.value == "9"); //Tipo pernocta
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

	const fnResetForm = () => {
		_grpGasto.mask(0);
		_eTipoGasto.value = ""; // clear selection
		const start = rutas.getHoraSalida();
		const end = rutas.getHoraLlegada();
		form.setval("#impGasto", 0).setval("#txtGasto").setval("#trayectos")
			.setval("#fMinGasto", start).setAttr("#fMinGasto", "min", start)
			.setval("#fMaxGasto", end).setAttr("#fMaxGasto", "max", end)
			.text(".filename", "").refresh(iris);
	}

	this.getNochesPendientes = () => (2/*rutas.getNumNoches()*/ - gastos.getNumPernoctas());
	this.setGastos = data => { gastos.setGastos(data); _tblGastos.render(gastos.getPaso5()).setChanged(); resumen.view(); }
	this.update = gastos => { gastos && self.setGastos(gastos); }

	this.validateGasto = data => {
console.log(data);
		const valid = form.getValidators();
		valid.gt0("impGasto", data.impGasto);
		if (data.tipoGasto == "9")
			return pernoctas.validate(data);
		// todo: validate campos grupo-gastos
		return valid.isOk();
	}
	this.validate = data => {
		//data.totKm = rutas.getTotKm();
console.log(data);
		const valid = form.getValidators();
		// todo: validacion de 250 km
		return valid.isOk();
	}

	tabs.setAction("paso5", () => { form.validate(self.validate) && form.sendTab(window.rcPaso5); });
	tabs.setAction("save5", () => { form.validate(self.validate) && form.sendTab(window.rcSave5, 5); });
	tabs.setViewEvent(5, fnResetForm); // reset form on view tab 5

	// update tabs events
	tabs.setInitEvent(12, rgastos.init);
	tabs.setViewEvent(12, rgastos.view);

	this.init = () => {
		const fnUnload = data => { i18n.confirm("remove") && xeco.sendId("rcUnloadGasto", data.id); };
		_tblGastos = form.setTable("#tbl-gastos", gasto.getTable()).set("#rcUnloadGasto", fnUnload);

		_eTipoGasto.onchange = fnChange; // Change event
		pf.uploads(form.querySelectorAll(".pf-upload-gasto"), fnChange);
		form.setDateRange("#fMinGasto", "#fMaxGasto");

		const resume = _tblGastos.getResume();
		gastos.getNumPernoctas = () => resume.noches; // redefine calc
		iris.getNumRutasOut = rutas.getNumRutasUnlinked; // calc redefined by rutasMaps modeule
		iris.getNumNochesPendientes = self.getNochesPendientes; // calc redefined by gastos module
		iris.getTextGasto = () => i18n.get(isTaxi() ? "lblDescTaxi" : "lblDescObserv"); // label text
		form.set("is-gastos-pendientes", () => (perfil.isMaps() && ((rutas.getNumRutasUnlinked() > 0) || (self.getNochesPendientes() > 0))))
			.set("is-noches-pendientes", () => (self.getNochesPendientes() > 0))
			.set("is-rutas-pendientes", () => (rutas.getNumRutasUnlinked() > 0));
		resumen.init();
	}

	window.validateGasto = () => form.validate(self.validateGasto);
	window.validateP5 = () => form.validate(self.validate);
	window.addGasto = (xhr, status, args) => {
		if (!window.showAlerts(xhr, status, args))
			return false; // Server error
		const data = coll.parse(args.gasto);
		if (!data || !data.id || !data.fref)
			return !form.showError("Error al adjuntar el gasto a la comunicación.");
		gastos.push(data); // añadir gasto a lista
		const links = coll.parse(args.rutas); // rutas asociadas al gasto
		links && rmaps.recalc(links); // actualizo el registro de rutas
		_tblGastos.render(self.getPaso5());
		fnResetForm();
	}
	window.unloadGasto = (xhr, status, args) => {
		if (!window.showAlerts(xhr, status, args))
			return false; // Server error
		const data = _tblGastos.getCurrentItem();
		gastos.remove(data);
		_tblGastos.remove(); // remove and reload
		fnResetForm();
	}
}

export default new Gastos();
