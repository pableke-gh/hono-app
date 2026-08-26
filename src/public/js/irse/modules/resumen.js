
import Tab from "../../core/components/tabs/Tab.js";
import api from "../../core/components/Api.js";
import valid from "../i18n/validators/irse.js";

import irse from "../model/Irse.js";
import rutas from "../model/Rutas.js";
import gastos from "../model/Gastos.js";

import observer from "../../core/util/Observer.js";
import SaveResumen from "../components/resumen/SaveResumen.js";
import ZipComisionado from "../components/resumen/ZipComisionado.js";
import ZipDocumentos from "../components/resumen/ZipDocumentos.js";

import tables from "../components/tables/tables.js";
import form from "./irse.js";

/*********** Tablas de resumen ***********/
export default class Resumen extends Tab {
	getKilometraje = () => tables.get("km");
	getTransportes = () => tables.get("transportes");
	getPernoctas = () => tables.get("pernoctas");
	getDietas = () => tables.get("dietas");
	getExtra = () => tables.get("tExtras");

	connectedCallback() {
		super.connectedCallback(); // init. component
		irse.isCenaFinal = () => (rutas.isLlegadaCena() && this.getExtra().isCena());

		const fnUpdate = () => { this.updateGastos(); form.refresh(irse);} // actualiza las tablas del resumen y opciones dinamicas para pernoctas, interurbano, etc.
		observer.subscribe("link", fnUpdate).subscribe("unlink", fnUpdate); // siempre ultimo en observar / escuchar las acciones link / unlink
	}

	updateGastos() {
		this.getTransportes().render(); // tabla resumen gastos de transporte (tickets, taxis, etc.)
		this.getPernoctas().render(); // tabla resumen pernoctas (noches de hotel, pensión etc.)
		this.getExtra().render(); // tabla para los gastos extraordinarios (ultima cena, etc.)
	}
	updateRutas(dietas) {
		this.getKilometraje().render(); // tabla resumen de kilometraje vehiculo propio
		this.getDietas().render(dietas); // tabla resumen dietas/manutenciones
	}
	view(dietas) {
		form.setValue("justifiKm", gastos.getJustifiKm()); // exceso km
		this.updateRutas(dietas); // tablas resumen, dietas/manutenciones
		this.updateGastos(); // tablas transportes, pernoctas, gastos extraordinarios...
	}

	send() {
		const data = { id: irse.getId(), justifiKm: form.getValue("justifiKm"), rutas: rutas.getRutas(), dietas: this.getDietas().getData() };
		return api.setJSON(data).json("/uae/iris/resumen/save").then(() => form.setChanged().refresh(irse));
	}
	prev1() {
		const km = this.getKilometraje().getResume(); // km table
		if (valid.resumen(km) && irse.isEditable() && form.isChanged()) // is valid change
			this.send(); // send data to server and go back
		else // reset change flag to avoid unnecessary saves
			form.setChanged(false);
		super.show(5); // go back tab
	}
	next1() {
		const km = this.getKilometraje().getResume();
		if (!valid.resumen(km))
			return; // if error => stop
		if (!irse.isEditable() || !form.isChanged())
			return super.next1(); // go next tab directly
		this.send().then(() => super.next1());
	}
}

customElements.define("save-resumen", SaveResumen, { extends: "button" });
customElements.define("zip-com", ZipComisionado, { extends: "button" });
customElements.define("zip-doc", ZipDocumentos, { extends: "button" });
