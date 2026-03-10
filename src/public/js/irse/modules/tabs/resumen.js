
import FormBase from "../../../components/forms/FormBase.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import valid from "../../i18n/validators.js";

import irse from "../../model/Irse.js"
import rutas from "../../model/Rutas.js"

import Kilometraje from "../tables/kilometraje.js";
import Transportes from "../tables/transportes.js";
import Pernoctas from "../tables/pernoctas.js";
import Dietas from "../tables/dietas.js";
import Extraordinarios from "../tables/extras.js";
import Observer from "../../util/Observer.js";

/*********** Tablas de resumen ***********/
export default class Resumen extends FormBase {
	#km = new Kilometraje(this);
	#trans = new Transportes(this);
	#pernoctas = new Pernoctas(this);
	#dietas = new Dietas(this);
	#extra = new Extraordinarios(this);

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init = () => {
		this.#km.init();
		this.#trans.init();
		this.#pernoctas.init();
		this.#dietas.init();
		this.#extra.init();
		irse.isCenaFinal = () => (rutas.isLlegadaCena() && this.#extra.isCena());

		const fnData = () => ({
			id: irse.getId(), justifiKm: this.getValue("justifiKm"),
			rutas: rutas.getRutas(), dietas: this.#dietas.getData()
		});
		const fnNext = () => this.setChanged().refresh(irse);

		tabs.setAction("paso6", () => {
			if (!valid.resumen(this.#km.getResume())) return; // if error => stop
			if (!irse.isEditable() || !this.isChanged()) return tabs.nextTab(); // go next tab directly
			api.setJSON(fnData()).json("/uae/iris/resumen/save").then(() => { fnNext(); tabs.goTab(); });
		});
		tabs.setAction("save6", () => {
			if (!valid.resumen(this.#km.getResume())) return; // if error => stop
			if (!this.isChanged()) return this.setOk(); // nada que guardar => mensaje ok
			api.setJSON(fnData()).json("/uae/iris/resumen/save").then(fnNext);
		});

		// download iris-facturas.zip / iris-doc.zip
		tabs.setAction("zip-com", () => api.init().blob("/uae/iris/zip/com", "iris-facturas.zip"));
		tabs.setAction("zip-doc", () => api.init().blob("/uae/iris/zip/doc", "iris-doc.zip"));

		const fnUpdate = () => this.updateGastos().refresh(irse); // actualiza las tablas del resumen y opciones dinamicas para pernoctas, interurbano, etc.
		Observer.subscribe("link", fnUpdate).subscribe("unlink", fnUpdate); // siempre ultimo en observar / escuchar las acciones link / unlink
	}

	updateGastos() {
		this.#trans.render(); // tabla resumen gastos de transporte (tickets, taxis, etc.)
		this.#pernoctas.render(); // tabla resumen pernoctas (noches de hotel, pensión etc.)
		this.#extra.render(); // tabla para los gastos extraordinarios (ultima cena, etc.)
		return this; // method chaining
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
