
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import valid from "../../i18n/validators/irse.js";

import irse from "../../model/Irse.js";
import rutas from "../../model/Rutas.js";

import Kilometraje from "../tables/kilometraje.js";
import Transportes from "../tables/transportes.js";
import Pernoctas from "../tables/pernoctas.js";
import Dietas from "../tables/dietas.js";
import Extraordinarios from "../tables/extras.js";

import observer from "../../../core/util/Observer.js";
import form from "../irse.js";

/*********** Tablas de resumen ***********/
class Resumen {
	#tab = tabs.getTab(6);
	#km = this.#tab.$1("#km");
	#trans = this.#tab.$1("#transportes");
	#pernoctas = this.#tab.$1("#pernoctas");
	#dietas = this.#tab.$1("#dietas");
	#extra = this.#tab.$1("#g-extra");

	init = () => {
		this.#km.init();
		this.#trans.init();
		this.#pernoctas.init();
		this.#dietas.init();
		this.#extra.init();
		irse.isCenaFinal = () => (rutas.isLlegadaCena() && this.#extra.isCena());

		const fnData = () => ({
			id: irse.getId(), justifiKm: form.getValue("justifiKm"),
			rutas: rutas.getRutas(), dietas: this.#dietas.getData()
		});
		const fnNext = () => form.setChanged().refresh(irse);

		tabs.setAction("paso6", () => {
			if (!valid.resumen(this.#km.getResume())) return; // if error => stop
			if (!irse.isEditable() || !form.isChanged()) return tabs.next(); // go next tab directly
			api.setJSON(fnData()).json("/uae/iris/resumen/save").then(() => { fnNext(); tabs.goTo(); });
		});
		tabs.setAction("save6", () => {
			if (!valid.resumen(this.#km.getResume())) return; // if error => stop
			if (!form.isChanged()) return form.setOk(); // nada que guardar => mensaje ok
			api.setJSON(fnData()).json("/uae/iris/resumen/save").then(fnNext);
		});

		// download iris-facturas.zip / iris-doc.zip
		tabs.setAction("zip-com", () => api.init().blob("/uae/iris/zip/com", "iris-facturas.zip"));
		tabs.setAction("zip-doc", () => api.init().blob("/uae/iris/zip/doc", "iris-doc.zip"));

		const fnUpdate = () => { this.updateGastos(); form.refresh(irse);} // actualiza las tablas del resumen y opciones dinamicas para pernoctas, interurbano, etc.
		observer.subscribe("link", fnUpdate).subscribe("unlink", fnUpdate); // siempre ultimo en observar / escuchar las acciones link / unlink
	}

	updateGastos() {
		this.#trans.render(); // tabla resumen gastos de transporte (tickets, taxis, etc.)
		this.#pernoctas.render(); // tabla resumen pernoctas (noches de hotel, pensión etc.)
		this.#extra.render(); // tabla para los gastos extraordinarios (ultima cena, etc.)
	}
	updateRutas(dietas) {
		this.#km.render(); // tabla resumen de kilometraje vehiculo propio
		this.#dietas.render(dietas); // tabla resumen dietas/manutenciones
	}
	view = dietas => {
		this.updateRutas(dietas); // tablas resumen, dietas/manutenciones
		this.updateGastos(); // tablas transportes, pernoctas, gastos extraordinarios...
	}

	getKilometraje = () => this.#km;
	getTransportes = () => this.#trans;
	getPernoctas = () => this.#pernoctas;
	getDietas = () => this.#dietas;
	getExtra = () => this.#extra;
}

customElements.define("table-km", Kilometraje, { extends: "table" });
customElements.define("table-transportes", Transportes, { extends: "table" });
customElements.define("table-pernoctas", Pernoctas, { extends: "table" });
customElements.define("table-dietas", Dietas, { extends: "table" });
customElements.define("table-extra", Extraordinarios, { extends: "table" });

export default new Resumen();
