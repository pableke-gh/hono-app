
import sb from "../../../components/types/StringBox.js";

import iris from "../../model/Iris.js";
import ruta from "../../model/ruta/Ruta.js";
import rutas from "../../model/ruta/Rutas.js";
import { CT } from "../../data/rutas.js";

import xeco from "../../../xeco/xeco.js";
import resumen from "../resumen.js";
import rro from "./rutasReadOnly.js";

function RutasMaps() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
	let _tblRutas; // itinerario

	this.getRutas = rutas.getRutas;
	this.size = rutas.size;
	this.isEmpty = rutas.isEmpty;
	this.setSaveRutas = () => { _tblRutas.setChanged(true); }

	this.getSalida = rutas.getSalida;
	this.getLlegada = rutas.getLlegada;
	this.getKm = () => _tblRutas.getResume().totKm;

	this.getNumRutasSinGastos = rutas.getNumRutasSinGastos;
	this.getRutaPrincipal = rutas.getRutaPrincipal;
	this.setRutaPrincipal = data => {
		rutas.setRutaPrincipal(data);
		_tblRutas.render(rutas.getRutas());
		return self;
	}

	this.setRutas = data => {
		rutas.setRutas(data);
		_tblRutas.render(data).setChanged();
	}
	this.saveRutas = () => {
		if (_tblRutas.isChanged()) { // save changes in rutas table
			const fnReplace = (key, value) => ((key == "p2") ? undefined : value); // reduce size
			form.saveTable("#rutas-json", _tblRutas, fnReplace); // guardo los cambios en las rutas
			rro.setRender();
			resumen.setUpdatable();
		}
		_tblRutas.setChanged();
		return self; // no hay cambios
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
	}
	this.init = () => {
		const fnRutasGt1 = () => (self.size() > 1); // como minimo hay 2 rutas
		form.set("is-rutas-gt-1", fnRutasGt1).set("is-editable-rutas-gt-1", () => (iris.isEditable() && fnRutasGt1()));

		_tblRutas = form.setTable("#tbl-rutas");
		_tblRutas.setMsgEmpty("msgRutasEmpty")
				.setBeforeRender(ruta.beforeRender).setRender(ruta.row).setFooter(ruta.tfoot)
				.setAfterRender(fnUpdateForm).set("#main", self.setRutaPrincipal);
		rutas.setResumen(_tblRutas.getResume());
		return self;
	}
}

export default  new RutasMaps();
