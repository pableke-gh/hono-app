
import Table from "../../../components/Table.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import valid from "../../i18n/validators.js";

import iris from "../../model/Iris.js";
import ruta from "../../model/ruta/RutaMaps.js";
import rutas from "../../model/ruta/Rutas.js";
import gastos from "../../model/gasto/Gastos.js";
import form from "../iris.js";

import place from "./place.js";
import rmun from "./mun.js";
import rvp from "./rutasVehiculoPropio.js";
import dietas from "../gastos/dietas.js";

class RutasMaps extends Table {
	constructor() {
		super(form.querySelector("#tbl-rutas"), ruta.getTable());

		const CT = { desp: 0, mask: 4 }; //default CT
		CT.origen = CT.destino = "Cartagena, España";
		CT.pais = CT.pais1 = CT.pais2 = "ES";

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
	setRutas = data => { rutas.setRutas(data); this.render(data).setChanged(); rvp.render(); } // no data chenged
	update = data => { data && this.setRutas(data); } // recalcula cambios en los gastos recibidos desde el servidor
	build = data => { rutas.update(data); this.render(data); } // actualizo el itinerario con la nueva ruta

	init = () => {
		rmun.init(); // formulario mun (paso 1)
		rvp.init(); // init rutas vehiculo propio (paso 6)
		const fnRutasGt1 = () => (rutas.size() > 1); // como minimo hay 2 rutas
		form.set("is-rutas-gt-1", fnRutasGt1).set("is-editable-rutas-gt-1", () => (iris.isEditable() && fnRutasGt1()));

		const fnPaso2 = tab => {
			const data = valid.itinerario(); // valido el itinerario
			if (!data) return false; // error en el formulario => no hago nada
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

		tabs.setAction("add-ruta", () => place.addRuta().then(this.build));
		tabs.setAction("paso2", () => fnPaso2());
		tabs.setAction("save2", () => fnPaso2("maps"));
	}
}

export default  new RutasMaps();
