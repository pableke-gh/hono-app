
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";

import iris from "../../model/Iris.js";
import ruta from "../../model/ruta/RutaMaps.js";
import rutas from "../../model/ruta/Rutas.js";
import gastos from "../../model/gasto/Gastos.js";
import xeco from "../../../xeco/xeco.js";

import place from "./place.js";
import rmun from "./rutasMun.js";
import rvp from "./rutasVehiculoPropio.js";
import dietas from "../gastos/dietas.js";

import { CT } from "../../data/rutas.js";

function RutasMaps() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
	const _tblRutas = form.setTable("#tbl-rutas", ruta.getTable()); // itinerario

	this.getRutas = rutas.getRutas;
	this.getResume = () => _tblRutas.getResume();
	this.getTotKm = () => _tblRutas.getProp("totKm");
	this.getImporte = () => _tblRutas.getProp("impKm");
	this.setRutaPrincipal = data => {
		rutas.setRutaPrincipal(data);
		_tblRutas.refreshBody();
	}

	// actualizo el registro de rutas y el itinerario (paso 2) y la tabla de vehiculos propios (paso 6)
	this.setRutas = data => { rutas.setRutas(data); _tblRutas.render(data).setChanged(); rvp.render(); }
	this.update = data => { data && self.setRutas(data); } // recalcula cambios en los gastos recibidos desde el servidor
	this.build = data => { rutas.update(data); _tblRutas.render(data); } // actualizo el itinerario con la nueva ruta

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
		rmun.init(); // formulario mun (paso 1)
		rvp.init(); // init rutas vehiculo propio (paso 6)
		const fnRutasGt1 = () => (rutas.size() > 1); // como minimo hay 2 rutas
		form.set("is-rutas-gt-1", fnRutasGt1).set("is-editable-rutas-gt-1", () => (iris.isEditable() && fnRutasGt1()));
		_tblRutas.setAfterRender(fnUpdateForm).set("#main", self.setRutaPrincipal); // set table actions
	}

	const fnValidate = data => { // validaciones para los mapas
		const valid = form.getValidators(); // valido el itinerario completo => min rutas = 2
		return (rutas.size() < 2) ? !valid.addRequired("destino", "errMinRutas") : rutas.validate();
	}
	const fnPaso2 = tab => {
		const data = form.validate(fnValidate);
		if (!data) // valido el formulario
			return false; // error => no hago nada
		if (!form.isChanged() && !_tblRutas.isChanged()) // compruebo cambios
			return form.nextTab(tab); // no cambios => salto al siguiente paso
		const temp = Object.assign(iris.getData(), data); // merge data to send
		const keys = [ "id", "g", "origen", "pais1", "destino", "pais2", "km1", "km2", "desp", "mask", "dt1", "dt2" ];
		temp.rutas = rutas.getRutas().map(ruta => Object.clone(ruta, keys)); // actualizo las rutas

		if (_tblRutas.isChanged()) // si hay cambios en las rutas
			dietas.build(); // recalculo las dietas
		temp.gastos = gastos.setPaso1(data, _tblRutas.setChanged().getResume()).getGastos(); // set km / iban
		api.setJSON(temp).json("/uae/iris/save").then(data => iris.update(data, tab));
		rvp.render(); // actualizo la tabla de vehiculos propios (paso 6)
	}

	tabs.setAction("add-ruta", () => place.addRuta().then(self.build).catch(form.setErrors));
	tabs.setAction("paso2", () => fnPaso2());
	tabs.setAction("save2", () => fnPaso2("maps"));

	/*********** PERFIL MUN tab-1 ***********/ 
	tabs.setInitEvent(1, rmun.view); // formulario mun (paso 1)
}

export default  new RutasMaps();
