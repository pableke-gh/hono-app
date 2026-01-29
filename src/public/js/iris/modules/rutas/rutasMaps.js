
import Table from "../../../components/Table.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import i18n from "../../i18n/langs.js";

import iris from "../../model/Iris.js";
import ruta from "../../model/ruta/RutaMaps.js";
import rutas from "../../model/ruta/Rutas.js";
import gastos from "../../model/gasto/Gastos.js";
import form from "../../../xeco/modules/SolicitudForm.js";

import place from "./place.js";
import rmun from "./rutasMun.js";
import rvp from "./rutasVehiculoPropio.js";
import dietas from "../gastos/dietas.js";

import { CT } from "../../data/rutas.js";

class RutasMaps extends Table {
	constructor() {
		super(form.querySelector("#tbl-rutas"), ruta.getTable());
		this.set("#main", this.setRutaPrincipal).setAfterRender(resume => {
			const last = rutas.getLlegada() || CT;
			const matricula = form.getval("#matricula-maps");
			rutas.getNumRutasUnlinked = () => resume.unlinked; // redefine calc
			form.setData({ origen: last.destino, f1: last.dt2, h1: last.dt2, f2: last.dt2, matricula }, ".ui-ruta")
				.delAttr("#f1", "max").restart("#destino").hide(".grupo-matricula");
			if (!last.dt1) // primera ruta?
				form.setFocus("#f1");
			ruta.afterRender(resume);
		});
	}

	getRutas = rutas.getRutas;
	getTotKm = () => this.getProp("totKm");
	getImporte = () => this.getProp("impKm");
	setRutaPrincipal = data => { rutas.setRutaPrincipal(data); this.refreshBody(); }

	// actualizo el registro de rutas y el itinerario (paso 2) y la tabla de vehiculos propios (paso 6)
	setRutas = data => { rutas.setRutas(data); this.render(data); rvp.render(); }
	update = data => { data && this.setRutas(data); } // recalcula cambios en los gastos recibidos desde el servidor
	build = data => { rutas.update(data); this.render(data); } // actualizo el itinerario con la nueva ruta

	init = () => {
		rmun.init(); // formulario mun (paso 1)
		rvp.init(); // init rutas vehiculo propio (paso 6)
		const fnRutasGt1 = () => (rutas.size() > 1); // como minimo hay 2 rutas
		form.set("is-rutas-gt-1", fnRutasGt1).set("is-editable-rutas-gt-1", () => (iris.isEditable() && fnRutasGt1()));

		const fnValidate = data => { // validaciones para los mapas
			const valid = i18n.getValidators(); // valido el itinerario completo => min rutas = 2
			return (rutas.size() < 2) ? !valid.addRequired("destino", "errMinRutas") : rutas.validate();
		}
		const fnPaso2 = tab => {
			const data = form.validate(fnValidate);
			if (!data) // valido el formulario
				return false; // error => no hago nada
			if (!form.isChanged() && !this.isChanged()) // compruebo cambios
				return form.nextTab(tab); // no cambios => salto al siguiente paso
			const temp = Object.assign(iris.getData(), data); // merge data to send
			const keys = [ "id", "g", "origen", "pais1", "destino", "pais2", "km1", "km2", "desp", "mask", "dt1", "dt2" ];
			temp.rutas = rutas.getRutas().map(ruta => Object.clone(ruta, keys)); // actualizo las rutas
	
			if (this.isChanged()) // si hay cambios en las rutas
				dietas.build(); // recalculo las dietas
			temp.gastos = gastos.setPaso1(data, this.setChanged().getResume()).getGastos(); // set km / iban
			api.setJSON(temp).json("/uae/iris/save").then(data => form.update(data, tab));
			rvp.render(); // actualizo la tabla de vehiculos propios (paso 6)
		}
	
		tabs.setAction("add-ruta", () => place.addRuta().then(this.build).catch(form.setErrors));
		tabs.setAction("paso2", () => fnPaso2());
		tabs.setAction("save2", () => fnPaso2("maps"));
	
		/*********** PERFIL MUN tab-1 ***********/ 
		tabs.setInitEvent(1, rmun.view); // formulario mun (paso 1)
	}
}

export default  new RutasMaps();
