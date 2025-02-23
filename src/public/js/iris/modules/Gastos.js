
import coll from "../../components/CollectionHTML.js";
import sb from "../../components/StringBox.js";
import pf from "../../components/Primefaces.js";
import i18n from "../../i18n/langs.js";
import gasto from "../model/Gasto.js";
import pernoctas from "../data/pernoctas/pernoctas.js";  

export default function Gastos(form) {
	const self = this; //self instance
	const rutas = form.get("rutas");
	let _gastos, _tblGastos; // container

	this.getFacturas = () => _gastos.filter(gasto.isFactura);
	this.getDietas = () => _gastos.filter(gasto.isDieta);
	this.getPaso5 = () => _gastos.filter(gasto.isPaso5);

	form.set("gastos", self);
	this.init = () => {
		_gastos = coll.parse(form.getText("#gastos-data")) || [];
		_tblGastos = form.setTable("#tbl-gastos");
		_tblGastos.setMsgEmpty("msgGastosEmpty")  //#{msg['msg.no.docs']}
				.setRender(gasto.row).setFooter(gasto.tfoot).render(self.getPaso5());
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
				.setval("#fAloMin", start).setAttr("#fAloMin", "min", start).setAttr("#fAloMin", "max", end)
				.setval("#fAloMax", end).setAttr("#fAloMax", "min", start).setAttr("#fAloMax", "max", end).text(".filename", "");
		pf.uploads(tab.querySelectorAll(".pf-upload"), fnChange);
		return self;
	}

	this.validate = data => {
		const valid = i18n.getValidators();
		return valid.isOk();
	}
	window.validateGasto = data => {
		const valid = i18n.getValidators();
		return valid.isOk();
	}
	window.updateGastos = (xhr, status, args) => {
		if (!window.showAlerts(xhr, status, args))
			return false; // Server error
		//const gastos = coll.parse(args.data);
		//_tblGastos.render(gastos);
	}
}
