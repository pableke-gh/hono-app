
import Form from "../../../components/forms/Form.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import valid from "../../i18n/validators.js";

import irse from "../../model/Irse.js"
import Kilometraje from "../tables/kilometraje.js";
import Transportes from "../tables/transportes.js";
import Pernoctas from "../tables/pernoctas.js";
import Dietas from "../tables/dietas.js";
import Extraordinarios from "../tables/extras.js";
import form from "../irse.js"

/*********** Tablas de resumen ***********/
export default class Resumen extends Form {
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

		const perfil = form.getPerfil();
		irse.getNumRutasVpMun = () => (this.#km.size() && perfil.isMun());
		irse.getNumRutasVpMaps = () => (this.#km.size() && !perfil.isMun());

		tabs.setAction("paso6", () => {
			if (!valid.resumen(this.#km.getResume())) return; // if error => stop
			if (!irse.isEditable() || !this.isChanged()) return tabs.nextTab(); // go next tab directly
			form.getRutas().save(); window.rcPaso6(); // llamo al servidor para sus validaciones
		});
		tabs.setAction("save6", () => {
			if (!valid.resumen(this.#km.getResume())) return; // if error => stop
			if (!this.isChanged()) return this.setOk(); // nada que guardar => mensaje ok
			form.getRutas().save(); window.rcSave6(); // call server to save and validate
		});

		// download iris-facturas.zip / iris-doc.zip
		tabs.setAction("zip-com", () => api.init().blob("/uae/iris/zip/com", "iris-facturas.zip"));
		tabs.setAction("zip-doc", () => api.init().blob("/uae/iris/zip/doc", "iris-doc.zip"));
	}

	update() {
		this.#trans.render(); // tabla resumen gastos de transporte (tickets, taxis, etc.)
		this.#pernoctas.render(); // tabla resumen pernoctas (noches de hotel, pensión etc.)
		this.#extra.render(); // tabla para los gastos extraordinarios (ultima cena, etc.)
		return this; // method chaining
	}
	view = dietas => {
		this.#km.render(); // tabla resumen de vehiculo propio paso 6
		this.update(); // tablas transportes, pernoctas, gastos extraordinarios...
		this.#dietas.render(dietas); // tabla resumen dietas/manutenciones
	}

	getKilometraje = () => this.#km;
	getDietas = () => this.#dietas;
}
