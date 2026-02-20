
import Form from "../../../components/forms/Form.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import valid from "../../i18n/validators.js";

import irse from "../../model/Irse.js"
import Kilometraje from "../tables/kilometraje.js";
import Dietas from "../tables/dietas.js";
import form from "../irse.js"

/*********** Tablas de resumen ***********/
export default class Resumen extends Form {
	#km = new Kilometraje(this);
	#dietas = new Dietas(this);

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init = () => {
		this.#km.init();
		this.#dietas.init();

		const perfil = form.getPerfil();
		irse.getNumRutasVpMun = () => (this.#km.size() && perfil.isMun());
		irse.getNumRutasVpMaps = () => (this.#km.size() && !perfil.isMun());
		window.paso6 = () => valid.paso6(this.#km.getResume()) && form.getRutas().save();

		tabs.setViewEvent(6, tab => this.#dietas.render(tab));
		// download iris-facturas.zip / iris-doc.zip
		tabs.setAction("zip-com", () => api.init().blob("/uae/iris/zip/com", "iris-facturas.zip"));
		tabs.setAction("zip-doc", () => api.init().blob("/uae/iris/zip/doc", "iris-doc.zip"));
	}

	view = () => {
		this.#km.render(); // tabla resumen de vehiculo propio paso 6
	}

	getKilometraje = () => this.#km;
	getDietas = () => this.#dietas;
}
