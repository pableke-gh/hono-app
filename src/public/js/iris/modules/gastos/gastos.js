
import coll from "../../../components/CollectionHTML.js";
import sb from "../../../components/types/StringBox.js";
import pf from "../../../components/Primefaces.js";
import i18n from "../../../i18n/langs.js";

import iris from "../iris.js";
import perfil from "../perfil/perfil.js"; 
import pernoctas from "./pernoctas.js";
import gasto from "../../model/gasto/Gasto.js";
import rutas from "../../model/ruta/Rutas.js";

function Gastos() {
	const self = this; //self instance
	const form = iris.getForm(); // form component
	let _gastos, _tblGastos; // container
	let _eTipoGasto, _grpGasto; // upload fields

	this.getGastos = () => _gastos;
	this.getFacturas = () => _gastos.filter(gasto.isFactura);
	this.getTickets = () => _gastos.filter(gasto.isTicket);
	this.getTransporte = () => _gastos.filter(gasto.isTransporte);
	this.getPernoctas = () => _gastos.filter(gasto.isPernocta);
	this.getDietas = () => _gastos.filter(gasto.isDieta);
	this.getPaso5 = () => _gastos.filter(gasto.isPaso5);

	const fnUpdateGastos = (data, fn) => { _gastos = _gastos.filter(fn).concat(data); return self; }
	this.updatePaso5 = data => fnUpdateGastos(data, gasto.isPaso5);
	this.updateTransporte = data => fnUpdateGastos(data, gasto.isTransporte);
	this.updateDietas = data => fnUpdateGastos(data, gasto.isDieta);

	this.getNochesPendientes = () => {
		const numNochesPendientes = _gastos.reduce((num, row) => (num + (gasto.isPernocta(row) ? row.num : 0)), 0);
		return rutas.getNumNoches() - numNochesPendientes;
	}

	const fnUpdateTab = () => {
		const numNochesPendientes = 0;
		const numRutasOut = rutas.getNumRutasSinGastos();
		form.setVisible(".ui-gastos-pendientes", perfil.isTrayectos() && ((numRutasOut > 0) || (numNochesPendientes > 0)))
			.setVisible(".ui-noches-pendientes", numNochesPendientes > 0)
			.setVisible(".ui-rutas-pendientes", numRutasOut > 0)
			.render("#info-rutas-gastos", { numRutasOut, numNochesPendientes });
		return self;
	}
	const fnResetForm = () => {
		_grpGasto.mask(0);
		_eTipoGasto.value = ""; // clear selection
		const start = sb.isoDate(rutas.getSalida().dt1);
		const end = sb.isoDate(rutas.getLlegada().dt2);
		form.setval("#impGasto", 0).setval("#txtGasto").setval("#trayectos")
				.setval("#fMinGasto", start).setAttr("#fMinGasto", "min", start).setAttr("#fMinGasto", "max", end)
				.setval("#fMaxGasto", end).setAttr("#fMaxGasto", "min", start).setAttr("#fMaxGasto", "max", end).text(".filename", "")
		return fnUpdateTab();
	}

	this.setGastos = gastos => {
		_gastos = gastos;
		_tblGastos.render(self.getPaso5());
		return self;
	}
	this.update = gastos => {
		gastos && self.setGastos(gastos);
		return self;
	}

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
		data.totKm = rutas.getKm();
console.log(data);
		const valid = form.getValidators();
		// todo: validacion de 250 km
		return valid.isOk();
	}

	this.initTab5 = tab => {
		if (!window.IRSE.editable)
			return self; // modo solo consulta

		_eTipoGasto = form.getInput("#tipo-gasto");
		_grpGasto = form.querySelectorAll(".grupo-gasto");

		const isTaxi = () => (_eTipoGasto.value == "4"); //ISU y taxi
		const isPernocta = () => (_eTipoGasto.value == "9"); //Tipo pernocta
		const isDoc = () => ["201", "202", "204", "205", "206"].includes(_eTipoGasto.value);
		const isExtra = () => ["301", "302", "303", "304"].includes(_eTipoGasto.value);
		const fnChange = () => {
			form.setval("#tipoGasto", _eTipoGasto.value)
					.text(".label-text-gasto", i18n.get("lblDescObserv"));
			if (isPernocta())
				_grpGasto.mask(0b11011);
			else if (isDoc())
				_grpGasto.mask(0b10101);
			else if (isExtra())
				_grpGasto.mask(0b10111);
			else if (isTaxi()) { //ISU y taxi
				form.text(".label-text-gasto", i18n.get("lblDescTaxi"));
				_grpGasto.mask(0b10111);
			}
			else if (0 < +_eTipoGasto.value)
				_grpGasto.mask(0b10011);
			else
				_grpGasto.mask(0b00001);			
		}

		_eTipoGasto.onchange = fnChange; // Change event
		pf.uploads(tab.querySelectorAll(".pf-upload"), fnChange);
		return fnResetForm();
	}
	this.init = () => {
		//_eTipoGasto = _grpGasto = null;
		_tblGastos = form.setTable("#tbl-gastos");
		const fnUnload = data => { i18n.confirm("remove") && pf.sendId("rcUnloadGasto", data.id); };
		_tblGastos.setMsgEmpty("msgGastosEmpty").setRender(gasto.row).setFooter(gasto.tfoot).set("#rcUnloadGasto", fnUnload);
		return self;
	}

	window.validateGasto = () => form.validate(self.validateGasto);
	window.validateP5 = () => form.validate(self.validate);
	window.addGasto = (xhr, status, args) => {
		if (!window.showAlerts(xhr, status, args))
			return false; // Server error
		const data = coll.parse(args.gasto);
		if (!data || !data.id || !data.fref)
			return !form.showError("Error al adjuntar el gasto a la comunicación.");
		_gastos.push(data); // añadir gasto a lista
		const links = coll.parse(args.rutas); // rutas asociadas al gasto
		links && rutas.setRutas(links); // actualizo el registro de rutas
		_tblGastos.render(self.getPaso5());
		_isPasoUpdate6 = true;
		fnResetForm();
	}
	window.unloadGasto = (xhr, status, args) => {
		if (!window.showAlerts(xhr, status, args))
			return false; // Server error
		const data = _tblGastos.getCurrentItem();
		_gastos = _gastos.filter(gasto => (gasto.id != data.id));
		_tblGastos.removeCurrent(); // remove and reload
		_isPasoUpdate6 = true;
		fnUpdateTab();
	}
}

export default new Gastos();
