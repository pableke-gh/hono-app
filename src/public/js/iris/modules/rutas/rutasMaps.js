
import coll from "../../../components/CollectionHTML.js";
import sb from "../../../components/types/StringBox.js";

import iris from "../iris.js";
import resumen from "../resumen.js";
import rro from "./rutasReadOnly.js";
import ruta from "../../model/ruta/Ruta.js";
import { CT } from "../../data/rutas.js";

function RutasTabs() {
	const self = this; //self instance
	const form = iris.getForm(); // form component
	let _rutas, _tblRutas; // itinerario
	let _saveRutas; // bool indicator

	this.getRutas = () => _rutas;
	this.size = () => coll.size(_rutas);
	this.isEmpty = () => coll.isEmpty(_rutas);
	this.setSaveRutas = () => { _saveRutas = true; }

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
		return self;
	}
	this.saveRutas = () => {
		if (!_saveRutas)
			return self; // no hay cambios
		const fnReplace = (key, value) => ((key == "p2") ? undefined : value); // reduce size
		form.saveTable("#rutas-json", _tblRutas, fnReplace); // guardo los cambios en las rutas
		rro.setRender();
		resumen.setUpdatable();
		return fnUpdateView();
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
		self.setSaveRutas();
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
