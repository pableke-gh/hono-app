
import coll from "../../../components/CollectionHTML.js";
import tabs from "../../../components/Tabs.js";
import sb from "../../../components/types/StringBox.js";
import i18n from "../../../i18n/langs.js";

import iris from "../iris.js";
import ruta from "../../model/ruta/Ruta.js";
import { CT, MUN } from "../../data/rutas.js";

function RutasTabs() {
	const self = this; //self instance
	const form = iris.getForm(); // form component
	let _rutas, _tblRutas, _tblReadOnly, _tblRutasGasto; // itinerario
	let _saveRutas, _renderRutasRead; // bool indicator

	this.getForm = () => form;
	this.getRutas = () => _rutas;
	this.size = () => coll.size(_rutas);
	this.isEmpty = () => coll.isEmpty(_rutas);

	this.getSalida = () => _rutas[0]; // primera ruta
	this.getLlegada = () => _rutas.at(-1); // ultima ruta
	this.getKm = () => _tblRutas.getResume().totKm;

	this.getRutasVeiculoPropio = () => _rutas.filter(ruta.isVehiculoPropio);
	this.getRutasSinGastos = () => _rutas.filter(data => (ruta.isAsociableGasto(data) && !data.g));
	this.getNumRutasSinGastos = () => _rutas.reduce((num, row) => (num + (ruta.isAsociableGasto(row) && !row.g)), 0);
	this.getRutaPrincipal = () => { // calculo la ruta principal del itinerario
		let diff = 0; // diferencia en milisegundos
		let principal = _rutas[0]; // primera ruta
		for (let i = 1; i < _rutas.length; i++) { //itero el itinerario
			const aux = sb.diffDate(_rutas[i].dt1, _rutas[i - 1].dt2);
			if (diff < aux) { // ruta en la que paso mas tiempo
				diff = aux;
				principal = _rutas[i - 1];
			}
		}
		return principal;
	}
	this.setRutaPrincipal = data => {
		_rutas.forEach(ruta.setOrdinaria);
		ruta.setPrincipal(data);
		_tblRutas.render(_rutas);
		return self;
	}

	const fnUpdateView = () => {
		form.setVisible(".rutas-gt-1", self.size() > 1); 
		_saveRutas = false;
		return self;
	}
	this.reload = data => {
		_rutas = data;
		return self;
	}
	this.setRutas = data => {
		_rutas = data;
		_tblRutas.render(_rutas);
		fnUpdateView();
		return self.mun();
	}
	this.saveRutas = () => {
		if (!_saveRutas)
			return self; // no hay cambios
		const fnReplace = (key, value) => ((key == "p2") ? undefined : value); // reduce size
		form.saveTable("#rutas-json", _tblRutas, fnReplace); // guardo los cambios en las rutas
		return fnUpdateView();
	}

	tabs.setAction("show-rutas-read", () => {
		if (!_tblReadOnly) {
			_tblReadOnly = form.setTable("#rutas-read");
			_tblReadOnly.setMsgEmpty("msgRutasEmpty").setBeforeRender(ruta.beforeRender).setRender(ruta.rowReadOnly).setFooter(ruta.tfoot);
		}
		if (_renderRutasRead)
			_tblReadOnly.render(_rutas);
		_renderRutasRead = false;
	});

	/*********** ASOCIACIÖN ENTRE RUTAS / GASTOS ***********/
	tabs.setInitEvent(12, tab12 => {
		_tblRutasGasto = form.setTable("#rutas-out");
		_tblRutasGasto.setMsgEmpty("msgRutasEmpty").setRender(ruta.rowRutasGasto).setFooter(ruta.tfootRutasGasto); 

		// init. all validations and inputs events only once
		tab12.querySelector("a#gasto-rutas").onclick = ev => { // button in tab12
			const list = tab12.querySelectorAll(".link-ruta:checked").map(el => el.value).join(",");
			if (list)
				form.setStrval("#rutas-json", list).click("#uploadGasto");
			else
				form.showError("errLinkRuta");
			ev.preventDefault();
		}
	});
	tabs.setViewEvent(12, () => {
		_tblRutasGasto.render(self.getRutasSinGastos());
	});
	/*********** ASOCIACIÖN ENTRE RUTAS / GASTOS ***********/ 

	const fnSetSaveRutas = () => { _saveRutas = _renderRutasRead = true; }
	this.mun = () => {
		const SELECTOR = ".grupo-matricula-mun";
		const ruta1Dia = Object.assign({}, MUN, _rutas[0]);
		_rutas[0] = ruta1Dia; // Save new data (routes.length = 1)

		const fields = form.getInputs(".ui-mun");
		form.afterChange(fnSetSaveRutas) // Any input change => save all rutas
			.setVisible(SELECTOR, ruta.isVehiculoPropio(ruta1Dia)) // grupo asociado al vehiculo propio
			.setField(fields[0], ruta1Dia.origen, ev => { ruta1Dia.origen = ruta1Dia.destino = ev.target.value; })
			.setField(fields[1], ruta1Dia.desp, ev => { ruta1Dia.desp = +ev.target.value; form.setVisible(SELECTOR, ruta1Dia.desp == 1); })
			.setField(fields[2], i18n.isoFloat(ruta1Dia.km1), ev => { ruta1Dia.km1 = ruta1Dia.km2 = i18n.toFloat(ev.target.value); })
			.setField(fields[3], ruta1Dia.dt1, ev => {
				ruta1Dia.dt1 = ev.target.value;
				ruta1Dia.dt2 = sb.endDay(ruta1Dia.dt1);
			});
		return self;
	}

	function fnUpdateForm() {
		const last = self.getLlegada() || CT;
		form.setval("#origen", last.destino).setval("#f1", sb.isoDate(last.dt2)).setval("#h1", sb.isoTimeShort(last.dt2))
			.setval("#destino").copy("#f2", "#f1").setval("#h2").setval("#principal", "0").setval("#desp")
			.delAttr("#f1", "max").delAttr("#f2", "min").hide(".grupo-matricula");
		if (!last.dt1)
			form.setFocus("#f1");
		else if (last.mask & 1) // es ruta principal?
			form.restart("#h1");
		else
			form.setFocus("#destino");
		fnSetSaveRutas();
	}
	this.init = () => {
		_tblRutas = form.setTable("#tbl-rutas");
		_tblRutas.setMsgEmpty("msgRutasEmpty")
				.setBeforeRender(ruta.beforeRender).setRender(ruta.row).setFooter(ruta.tfoot)
				.setAfterRender(fnUpdateForm).set("#main", self.setRutaPrincipal);
		return self;
	}
}

export default  new RutasTabs();
