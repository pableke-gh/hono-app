
import coll from "../../../components/CollectionHTML.js";
import tabs from "../../../components/Tabs.js";
import i18n from "../../i18n/langs.js";

import iris from "../../model/Iris.js";
import gasto from "../../model/gasto/Gasto.js";
import gastos from "../../model/gasto/Gastos.js";
import rutas from "../../model/ruta/Rutas.js";

import perfil from "../perfil/perfil.js";
import gModule from "./gasto.js";
import resumen from "../resumen.js";

import rmaps from "../rutas/rutasMaps.js";
import rgastos from "../rutas/rutasGasto.js"; 
import xeco from "../../../xeco/xeco.js";

function Gastos() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
	const _tblGastos = form.setTable("#tbl-gastos", gasto.getTable());

	this.getNochesPendientes = () => (2/*rutas.getNumNoches()*/ - gastos.getNumPernoctas());
	this.setGastos = data => {
		gastos.setGastos(data);
		_tblGastos.render(gastos.getPaso5()).setChanged();
		resumen.view();
	}
	this.update = gastos => {
		gastos && self.setGastos(gastos);
	}

	this.validate = data => {
		//data.totKm = rutas.getTotKm();
console.log(data);
		const valid = form.getValidators();
		// todo: validacion de 250 km
		return valid.isOk();
	}

	tabs.setAction("paso5", () => { form.validate(self.validate) && form.sendTab(window.rcPaso5); });
	tabs.setAction("save5", () => { form.validate(self.validate) && form.sendTab(window.rcSave5, 5); });
	tabs.setAction("click-next", link => { link.nextElementSibling.click(); setTimeout(window.working, 400); });

	// update tabs events
	tabs.setInitEvent(12, rgastos.init);
	tabs.setViewEvent(12, rgastos.view);

	this.init = () => {
		gModule.init(); // init fields for gasto
		resumen.init(); // init tables for paso 6
		const fnUnload = data => { i18n.confirm("remove") && xeco.sendId("rcUnloadGasto", data.id); };
		_tblGastos.set("#rcUnloadGasto", fnUnload); // set table action

		const resume = _tblGastos.getResume();
		gastos.getNumPernoctas = () => resume.noches; // redefine calc
		iris.getNumRutasOut = () => rutas.getNumRutasUnlinked(); // call function after redefined by rutasMaps modeule
		iris.getNumNochesPendientes = () => self.getNochesPendientes(); // call function after redefined by gastos module
		const fnGastosPendientes = () => (perfil.isMaps() && ((rutas.getNumRutasUnlinked() > 0) || (self.getNochesPendientes() > 0)));
		form.set("is-gastos-pendientes", fnGastosPendientes).set("is-noches-pendientes", self.getNochesPendientes).set("is-rutas-pendientes", iris.getNumRutasOut)
			.set("is-zip-com", gastos.getNumGastosComisionado).set("is-zip-doc", gastos.getNumGastosDoc);
	}

	window.addGasto = (xhr, status, args) => {
		if (!window.showAlerts(xhr, status, args))
			return false; // Server error
		const data = coll.parse(args.gasto);
		if (!data || !data.id || !data.fref) // valido campos obligatorios
			return !form.showError("Error al adjuntar el gasto a la comunicación.");
		gastos.push(data); // añado el nuevo gasto a lista de gastos
		rmaps.recalc(coll.parse(args.rutas)); // actualizo el registro de rutas
		_tblGastos.render(gastos.getPaso5()); // actualizo la tabla de gastos
		gModule.reset(); // clear fields
	}
	window.unloadGasto = (xhr, status, args) => {
		if (!window.showAlerts(xhr, status, args))
			return false; // Server error
		_tblGastos.flush(); // remove and reload
		gModule.reset(); // clear fields
	}
}

export default new Gastos();
