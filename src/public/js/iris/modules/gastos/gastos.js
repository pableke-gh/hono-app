
import coll from "../../../components/CollectionHTML.js";
import sb from "../../../components/types/StringBox.js";
import pf from "../../../components/Primefaces.js";
import i18n from "../../../i18n/langs.js";

import iris from "../iris.js";
import transportes from "./transportes.js"; 
import pernoctas from "./pernoctas.js"; 
import rutas from "../rutas/rutas.js";
import gasto from "../../model/gasto/Gasto.js";

function Gastos() {
	const self = this; //self instance
	const form = iris.getForm(); // form component
	let _gastos, _tblGastos; // container
	let _isPasoUpdate6; // bool indicator

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
	this.setGastos = gastos => {
		_gastos = gastos;
		_tblGastos.render(self.getPaso5());
		return self;
	}

	this.init = () => {
		transportes.init();
		pernoctas.init();
		const fnUnload = data => { i18n.confirm("remove") && pf.sendId("rcUnloadGasto", data.id); };

		_tblGastos = form.setTable("#tbl-gastos");
		_tblGastos.setMsgEmpty("msgGastosEmpty").setRender(gasto.row).setFooter(gasto.tfoot).set("#rcUnloadGasto", fnUnload);
		return self;
	}
	this.initTab5 = tab => {
		const eTipoGasto = form.getInput("#tipo-gasto"); //select tipo
		if (!eTipoGasto)
			return; // modo solo consulta

		const isTaxi = () => (eTipoGasto.value == "4"); //ISU y taxi
		const isPernocta = () => (eTipoGasto.value == "9"); //Tipo pernocta
		const isDoc = () => ["201", "202", "204", "205", "206"].includes(eTipoGasto.value);
		const isExtra = () => ["301", "302", "303", "304"].includes(eTipoGasto.value);
		const grupos = tab.querySelectorAll(".grupo-gasto");
		const fnChange = () => {
			form.setval("#tipoGasto", eTipoGasto.value)
					.text(".label-text-gasto", i18n.get("lblDescObserv"));
			if (isPernocta())
				grupos.mask(0b11011);
			else if (isDoc())
				grupos.mask(0b10101);
			else if (isExtra())
				grupos.mask(0b10111);
			else if (isTaxi()) { //ISU y taxi
				form.text(".label-text-gasto", i18n.get("lblDescTaxi"));
				grupos.mask(0b10111);
			}
			else if (0 < +eTipoGasto.value)
				grupos.mask(0b10011);
			else
				grupos.mask(0b00001);			
		}

		// trayectos de ida y vuelta => al menos 2
		tab.querySelectorAll(".rutas-gt-1").toggle("hide", rutas.size() < 2);

		const start = sb.isoDate(rutas.getSalida().dt1);
		const end = sb.isoDate(rutas.getLlegada().dt2);

		grupos.mask(0);
		eTipoGasto.value = ""; // clear selection
		eTipoGasto.onchange = fnChange; // Change event
		form.setval("#impGasto", 0).setval("#txtGasto").setval("#trayectos")
				.setval("#fMinGasto", start).setAttr("#fMinGasto", "min", start).setAttr("#fMinGasto", "max", end)
				.setval("#fMaxGasto", end).setAttr("#fMaxGasto", "min", start).setAttr("#fMaxGasto", "max", end).text(".filename", "");
		pf.uploads(tab.querySelectorAll(".pf-upload"), fnChange);
		return self;
	}

	this.validateGasto = data => {
		const valid = i18n.getValidators();
		return valid.isOk();
	}
	this.validate = () => {
		//const valid = i18n.getValidators();
		if (_isPasoUpdate6) {
			transportes.setTransportes(self.getTransporte());
			pernoctas.setPernoctas(self.getPernoctas());
			_isPasoUpdate6 = false;
		}
		return true;
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
		// todo: actualizar rutas si el gasto esta asociado a estas
		_tblGastos.render(self.getPaso5());
		_isPasoUpdate6 = true;
	}
	window.unloadGasto = (xhr, status, args) => {
		if (!window.showAlerts(xhr, status, args))
			return false; // Server error
		const data = _tblGastos.getCurrentItem();
		_gastos = _gastos.filter(gasto => (gasto.id != data.id));
		_tblGastos.removeCurrent(); // remove and reload
		_isPasoUpdate6 = true;
	}
}

export default new Gastos();
