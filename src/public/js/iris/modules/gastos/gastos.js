
import coll from "../../../components/CollectionHTML.js";
import tabs from "../../../components/Tabs.js";
import i18n from "../../i18n/langs.js";

import iris from "../../model/Iris.js";
import gasto from "../../model/gasto/Gasto.js";
import gastos from "../../model/gasto/Gastos.js";
import rutas from "../../model/ruta/Rutas.js";

import perfil from "../perfil/perfil.js";
import resumen from "../resumen.js";
import gp5 from "./gasto.js";

import rmaps from "../rutas/rutasMaps.js";
import rgastos from "../rutas/rutasGasto.js"; 
import xeco from "../../../xeco/xeco.js";

function Gastos() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
	const _tblGastos = form.setTable("#tbl-gastos", gasto.getTable());

	this.getNochesPendientes = () => (rutas.getNumNoches() - gastos.getNumPernoctas());
	this.setGastos = data => { gastos.setGastos(data); _tblGastos.render(gastos.getPaso5()).setChanged(); }
	this.update = gastos => { gastos && self.setGastos(gastos); }

	this.setKm = data => { gastos.setKm(data, rmaps.getResume()); return self; } 
	this.setSubvencion = data => { gastos.setSubvencion(data); return self; } 
	this.setCongreso = data => { gastos.setCongreso(data); return self; } 
	this.setAsistencia = data => { gastos.setAsistencia(data); return self; } 
	this.setIban = data => { gastos.setIban(data); return self; } 
	this.setBanco = data => { gastos.setBanco(data); return self; } 
	this.save = () => { form.stringify("#gastos-json", gastos.getGastos()); } // serialize gastos

	this.validate = data => {
		const valid = form.getValidators();
		if (!_tblGastos.getProp("adjuntos") && (rmaps.getTotKm() > 250))
			valid.addRequired("adjuntos", "errDocFacturas"); // validacion de 250 km
		return valid.isOk();
	}

	tabs.setAction("paso5", () => { form.validate(self.validate) && form.sendTab(window.rcPaso5); });
	tabs.setAction("save5", () => { form.validate(self.validate) && form.sendTab(window.rcSave5, 5); });
	tabs.setAction("click-next", link => { link.nextElementSibling.click(); setTimeout(window.working, 450); });

	// update tabs events
	tabs.setInitEvent(12, rgastos.init);
	tabs.setViewEvent(12, rgastos.view);

	this.init = () => {
		gp5.init(); // init fields for gasto
		const fnUnload = data => { i18n.confirm("remove") && xeco.sendId("rcUnloadGasto", data.id); };
		_tblGastos.set("#rcUnloadGasto", fnUnload); // set table action

		const resume = _tblGastos.getResume();
		gastos.getNumPernoctas = () => resume.noches; // redefine calc
		iris.getNumRutasOut = () => rutas.getNumRutasUnlinked(); // call function after redefined by rutasMaps modeule
		iris.getNumNochesPendientes = () => self.getNochesPendientes(); // call function after redefined by gastos module
		const fnGastosPendientes = () => (perfil.isMaps() && ((rutas.getNumRutasUnlinked() > 0) || (self.getNochesPendientes() > 0)));
		form.set("is-gastos-pendientes", fnGastosPendientes).set("is-noches-pendientes", self.getNochesPendientes).set("is-rutas-pendientes", iris.getNumRutasOut)
			.set("is-zip-com", () => (iris.isDisabled() && resume.docComisionado)).set("is-zip-doc", () => (iris.isDisabled() && resume.otraDoc));
	}

	window.addGasto = (xhr, status, args) => {
		if (!window.showTab(xhr, status, args, 5))
			return false; // Server error
		const data = coll.parse(args.gasto);
		if (!data || !data.id || !data.fref) // valido campos obligatorios
			return !form.showError("Error al adjuntar el gasto a la comunicación.");
		gastos.push(data); // añado el nuevo gasto a lista de gastos
		rmaps.update(coll.parse(args.rutas)); // actualizo el registro de rutas
		_tblGastos.render(gastos.getPaso5()); // actualizo la tabla de gastos (paso 5)
		resumen.setFactComisionado(); // update facturas a nombre del comisionado
		gp5.reset(); // clear fields
	}
	window.unloadGasto = (xhr, status, args) => {
		if (!window.showAlerts(xhr, status, args))
			return false; // Server error
		gastos.remove(_tblGastos.getCurrentItem()); // remove gasto from array
		rmaps.update(coll.parse(args.rutas)); // actualizo el registro de rutas
		_tblGastos.flush(); // remove and reload table gastos (paso 5)
		resumen.setFactComisionado(); // update facturas a nombre del comisionado
		gp5.reset(); // clear fields
	}
}

export default new Gastos();
