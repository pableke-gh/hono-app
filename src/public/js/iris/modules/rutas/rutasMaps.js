
import tabs from "../../../components/Tabs.js";

import iris from "../../model/Iris.js";
import ruta from "../../model/ruta/RutaMaps.js";
import rutas from "../../model/ruta/Rutas.js";
import { CT } from "../../data/rutas.js";

import rro from "./rutasReadOnly.js";
import rvp from "./rutasVehiculoPropio.js";
import xeco from "../../../xeco/xeco.js";

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
	this.getTotKm = () => _tblRutas.getProp("totKm");

	this.setRutaPrincipal = data => {
		rutas.setRutaPrincipal(data);
		_tblRutas.refreshBody();
	}

	this.setRutas = data => {
		rutas.setRutas(data); // actualizo el array de rutas
		_tblRutas.render(data).setChanged(); // actualizo la tabla de rutas
		rvp.render(); // actualizo la tabla de vehiculos propios (paso 6)
	}
	this.recalc = data => {
		rutas.setRutas(data); // actualizo el array de rutas
		_tblRutas.recalc(); // recalcula los datos de las rutas
	}
	this.saveRutas = () => {
		if (_tblRutas.isChanged()) { // save changes in rutas table
			const keys = [ "p2", "flag", "spanFlag", "tplFlag" ]; // excluded fields
			const fnReplace = (key, value) => (keys.includes(key) ? undefined : value); // reduce size
			form.saveTable("#rutas-json", _tblRutas, fnReplace); // guardo los cambios en las rutas
			rro.setRender(); // fuerza la actualización de la tabla de consulta (paso 5)
			rvp.render(); // actualizo la tabla de vehiculos propios (paso 6)
		}
		_tblRutas.setChanged();
		return self;
	}

	function fnUpdateForm(resume) {
		const last = self.getLlegada() || CT;
		rutas.getNumRutasUnlinked = () => resume.unlinked; // redefine calc
		form.setval("#origen", last.destino).setval("#f1", last.dt2).setval("#h1", last.dt2)
			.setval("#destino").copy("#f2", "#f1").setval("#h2").delAttr("#f1", "max")
			.setval("#principal", "0").setval("#desp").hide(".grupo-matricula");
		if (!last.dt1)
			form.setFocus("#f1");
		else if (ruta.isPrincipal(last))
			form.restart("#h1");
		else
			form.setFocus("#destino");
	}
	this.init = () => {
		rvp.init(); // init rutas vehiculo propio (paso 6)
		const fnRutasGt1 = () => (self.size() > 1); // como minimo hay 2 rutas
		form.set("is-rutas-gt-1", fnRutasGt1).set("is-editable-rutas-gt-1", () => (iris.isEditable() && fnRutasGt1()));

		_tblRutas = form.setTable("#tbl-rutas", ruta.getTable());
		_tblRutas.setAfterRender(fnUpdateForm).set("#main", self.setRutaPrincipal);
	}

	// tabla de consulta del itinerario (paso 5)
	tabs.setAction("show-rutas-read", rro.view);
}

export default  new RutasMaps();
