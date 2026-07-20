
import tabs from "../../core/components/tabs/TabsOld.js";
import api from "../../core/components/Api.js";

import irse from "../model/Irse.js";
import rutas from "../model/Rutas.js";
import gastos from "../model/Gastos.js";

import observer from "../../core/util/Observer.js";
import PrevResumen from "../components/resumen/PrevResumen.js";
import NextResumen from "../components/resumen/NextResumen.js";
import SaveResumen from "../components/resumen/SaveResumen.js";
import tables from "../components/tables/tables.js";
import form from "./irse.js";

/*********** Tablas de resumen ***********/
class Resumen {
	getKilometraje = () => tables.get("km");
	getTransportes = () => tables.get("transportes");
	getPernoctas = () => tables.get("pernoctas");
	getDietas = () => tables.get("dietas");
	getExtra = () => tables.get("g-extra");

	init() {
		this.getKilometraje().init();
		this.getTransportes().init();
		this.getPernoctas().init();
		this.getDietas().init();
		this.getExtra().init();
		irse.isCenaFinal = () => (rutas.isLlegadaCena() && this.getExtra().isCena());

		// download iris-facturas.zip / iris-doc.zip
		tabs.setAction("zip-com", () => api.init().blob("/uae/iris/zip/com", "iris-facturas.zip"));
		tabs.setAction("zip-doc", () => api.init().blob("/uae/iris/zip/doc", "iris-doc.zip"));

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
	save() {
		const data = { id: irse.getId(), justifiKm: form.getValue("justifiKm"), rutas: rutas.getRutas(), dietas: this.getDietas().getData() };
		return api.setJSON(data).json("/uae/iris/resumen/save").then(() => form.setChanged().refresh(irse));
	}
}

customElements.define("prev-resumen", PrevResumen, { extends: "button" });
customElements.define("next-resumen", NextResumen, { extends: "button" });
customElements.define("save-resumen", SaveResumen, { extends: "button" });

export default new Resumen();
