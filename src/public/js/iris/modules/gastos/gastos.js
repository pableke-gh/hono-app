
import Table from "../../../components/Table.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import valid from "../../i18n/validators.js";

import iris from "../../model/Iris.js";
import rutas from "../../model/ruta/Rutas.js";
import rro from "../../model/ruta/RutaReadOnly.js";
import gasto from "../../model/gasto/Gasto.js";
import gastos from "../../model/gasto/Gastos.js";

import gp5 from "./gasto.js";
import actividad from "../perfil/actividad.js";
import rmaps from "../rutas/rutasMaps.js";
import resumen from "../resumen.js";
import form from "../../../xeco/modules/solicitud.js";

class Gastos extends Table {
	constructor() {
		super(form.querySelector("#tbl-gastos"), gasto.getTable());
		this.set("#adjunto", gasto => api.init().blob("/uae/iris/download?id=" + gasto.cod, gasto.nombre)); // uuid file and name
		this.setRemove(gasto => { // remove handler
			const url = "/uae/iris/unload?id=" + gasto.id;
			return api.init().json(url).then(data => {
				gastos.removeById(gasto); // remove gasto from array
				rmaps.update(data.rutas); // actualizo el registro de rutas
				resumen.setFactComisionado(); // tablas del resumen
			});
		});
	}

	getNochesPendientes = () => (rutas.getNumNoches() - gastos.getNumPernoctas());
	setGastos = data => { gastos.setGastos(data); super.render(gastos.getPaso5()); }
	update = gastos => { gastos && this.setGastos(gastos); }
	addGasto = (gasto, rutas) => {
		gastos.push(gasto); // añado el nuevo gasto a lista de gastos
		this.render(gastos.getPaso5()); // actualizo la tabla de gastos (paso 5)
		rmaps.update(rutas); // actualizo el registro de rutas
		resumen.setFactComisionado(); // tablas del resumen
	}

	init = () => {
		const resume = this.getResume();
		gastos.getNumPernoctas = () => resume.noches; // redefine calc
		iris.getNumRutasOut = () => rutas.getNumRutasUnlinked(); // call function after redefined by rutasMaps modeule
		iris.getNumNochesPendientes = () => this.getNochesPendientes(); // call function after redefined by gastos module
		const fnGastosPendientes = () => (actividad.isMaps() && ((rutas.getNumRutasUnlinked() > 0) || (this.getNochesPendientes() > 0)));
		form.set("is-gastos-pendientes", fnGastosPendientes).set("is-noches-pendientes", this.getNochesPendientes).set("is-rutas-pendientes", iris.getNumRutasOut)
			.set("is-zip-com", () => (iris.isDisabled() && resume.docComisionado)).set("is-zip-doc", () => (iris.isDisabled() && resume.otraDoc))
			.set("is-ac", globalThis.none).set("is-irpf", globalThis.none); // no aplica para esta version

		const fnPaso5 = tab => {
			valid.reset();
			if (!this.getProp("adjuntos") && (rmaps.getTotKm() > 250))
				valid.addRequired("adjuntos", "errDocFacturas"); // validacion de 250 km
			return valid.isError() ? valid.fail() : form.nextTab(tab); // valido el formulario
		}
		tabs.setAction("paso5", () => fnPaso5());
		tabs.setAction("save5", () => fnPaso5(5));
		tabs.setInitEvent(5, gp5); // init fields for gasto
		tabs.setInitEvent("itinerario", () => {
			// actualiza la tabla de consulta (paso 5) al abrir el enlace
			const _tblReadOnly = form.setTable("#rutas-read", rro.getTable()); // itinerario
			tabs.setViewEvent("itinerario", () => _tblReadOnly.view(rutas.getRutas()));
		});
	}
}

export default new Gastos();
