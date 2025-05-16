
import tabs from "../../../components/Tabs.js";

import iris from "../../model/Iris.js";
import ruta from "../../model/ruta/RutaMaps.js";
import rutas from "../../model/ruta/Rutas.js";
import { CT } from "../../data/rutas.js";

import rro from "./rutasReadOnly.js";
import rvp from "./rutasVehiculoPropio.js";
import xeco from "../../../xeco/xeco.js";
import gastos from "../gastos/gastos.js";

function RutasMaps() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
	const _tblRutas = form.setTable("#tbl-rutas", ruta.getTable()); // itinerario

	this.getRutas = rutas.getRutas;
	this.getResume = () => _tblRutas.getResume();
	this.getTotKm = () => _tblRutas.getProp("totKm");
	this.setSaveRutas = () => { _tblRutas.setChanged(true); }
	this.setRutaPrincipal = data => {
		rutas.setRutaPrincipal(data);
		_tblRutas.refreshBody();
	}

	// actualizo el array y la tabla de rutas
	const fnUpdate = data => { rutas.setRutas(data); _tblRutas.render(data).setChanged(); }
	this.setRutas = data => { fnUpdate(data); rvp.render(); } // actualizo la tabla de vehiculos propios (paso 6)
	this.update = data => { data && fnUpdate(data); } // recalcula cambios en los gastos

	this.saveRutas = data => {
		if (_tblRutas.isChanged()) {
			const keys = [ "p2", "matricula", "flag", "spanFlag", "tplFlag" ]; // excluded fields
			const fnReplace = (key, value) => (keys.includes(key) ? undefined : value); // reduce size
			form.saveTable("#rutas-json", _tblRutas, fnReplace); // guardo los cambios en las rutas
			rro.setRender(); // fuerza la actualización de la tabla de consulta (paso 5)
			rvp.render(); // actualizo la tabla de vehiculos propios (paso 6)
			// todo: build dietas con temporal api...
		}
		if (form.isChanged()) { // save gasto km (matricula) e iban (tipo dieta)
			_tblRutas.setChanged().setProp("impKm", rvp.getImporte());
			gastos.setKm(data).setIban(data).save();
		}
		return self;
	}

	function fnUpdateForm(resume) {
		const last = rutas.getLlegada() || CT;
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
		const fnRutasGt1 = () => (rutas.size() > 1); // como minimo hay 2 rutas
		form.set("is-rutas-gt-1", fnRutasGt1).set("is-editable-rutas-gt-1", () => (iris.isEditable() && fnRutasGt1()));
		_tblRutas.setAfterRender(fnUpdateForm).set("#main", self.setRutaPrincipal); // set table actions
	}

	// tabla de consulta del itinerario (paso 5)
	tabs.setAction("show-rutas-read", rro.view);
}

export default  new RutasMaps();
