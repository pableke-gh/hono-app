
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import i18n from "../../i18n/langs.js";

import iris from "../../model/Iris.js";
import rutas from "../../model/ruta/Rutas.js";
import rro from "../../model/ruta/RutaReadOnly.js";
import gasto from "../../model/gasto/Gasto.js";
import gastos from "../../model/gasto/Gastos.js";

import gp5 from "./gasto.js";
import actividad from "../perfil/actividad.js";
import rmaps from "../rutas/rutasMaps.js";
import resumen from "../resumen.js";
import xeco from "../../../xeco/xeco.js";

function Gastos() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
	const _tblGastos = form.setTable("#tbl-gastos", gasto.getTable());

	this.getNochesPendientes = () => (rutas.getNumNoches() - gastos.getNumPernoctas());
	this.setGastos = data => { gastos.setGastos(data); _tblGastos.render(gastos.getPaso5()).setChanged(); }
	this.update = gastos => { gastos && self.setGastos(gastos); }

	this.addGasto = (gasto, rutas) => {
		gastos.push(gasto); // añado el nuevo gasto a lista de gastos
		_tblGastos.render(gastos.getPaso5()); // actualizo la tabla de gastos (paso 5)
		rmaps.update(rutas); // actualizo el registro de rutas
		resumen.setFactComisionado(); // tablas del resumen
	}
	this.removeGasto = (gasto, rutas) => {
		gastos.removeById(gasto); // remove gasto from array
		_tblGastos.flush(); // remove and reload table gastos (paso 5)
		rmaps.update(rutas); // actualizo el registro de rutas
		resumen.setFactComisionado(); // tablas del resumen
	}

	this.init = () => {
		const resume = _tblGastos.getResume();
		gastos.getNumPernoctas = () => resume.noches; // redefine calc
		iris.getNumRutasOut = () => rutas.getNumRutasUnlinked(); // call function after redefined by rutasMaps modeule
		iris.getNumNochesPendientes = () => self.getNochesPendientes(); // call function after redefined by gastos module
		const fnGastosPendientes = () => (actividad.isMaps() && ((rutas.getNumRutasUnlinked() > 0) || (self.getNochesPendientes() > 0)));
		form.set("is-gastos-pendientes", fnGastosPendientes).set("is-noches-pendientes", self.getNochesPendientes).set("is-rutas-pendientes", iris.getNumRutasOut)
			.set("is-zip-com", () => (iris.isDisabled() && resume.docComisionado)).set("is-zip-doc", () => (iris.isDisabled() && resume.otraDoc))
			.set("is-ac", globalThis.none).set("is-irpf", globalThis.none); // no aplica para esta version
	}

	const fnPaso5 = tab => {
		const valid = form.getValidators();
		if (!_tblGastos.getProp("adjuntos") && (rmaps.getTotKm() > 250))
			valid.addRequired("adjuntos", "errDocFacturas"); // validacion de 250 km
		if (valid.isError()) // valido el formulario
			return !form.setErrors(); // error => no hago nada
		_tblGastos.setChanged();
		form.setChanged().nextTab(tab);
	}
	tabs.setAction("paso5", () => fnPaso5());
	tabs.setAction("save5", () => fnPaso5(5));
	tabs.setInitEvent(5, gp5); // init fields for gasto
	tabs.setInitEvent("itinerario", () => {
		// actualiza la tabla de consulta (paso 5) al abrir la pestaña
		const _tblReadOnly = form.setTable("#rutas-read", rro.getTable()); // itinerario
		tabs.setViewEvent("itinerario", () => _tblReadOnly.view(rutas.getRutas()));
	});

	_tblGastos.set("#adjunto", gasto => { // set table action
		api.init().blob("/uae/iris/download?id=" + gasto.cod, gasto.nombre); // uuid file and name
	});
	_tblGastos.set("#unload", gasto => { // set table action
		const url = "/uae/iris/unload?id=" + gasto.id;
		i18n.confirm("remove") && api.init().json(url).then(data => self.removeGasto(gasto, data.rutas));
	});
}

export default new Gastos();
