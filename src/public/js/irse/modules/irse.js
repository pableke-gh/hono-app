
import valid from "../i18n/validators.js";
import irse from "../model/Irse.js";
import Perfil from "./tabs/perfil.js";
import Paso1 from "./tabs/paso1.js";
import Rutas from "./tabs/rutas.js";
import Paso3 from "./tabs/paso3.js";
import Paso5 from "./tabs/paso5.js";
import Resumen from "./tabs/resumen.js";
import Paso9 from "./tabs/paso9.js";
import InformeISU from "./tabs/otri.js";

import Solicitudes from "./solicitudes.js";
import Solicitud from "../../core/modules/solicitud.js";

class IrseSolicitud extends Solicitud {
	#solicitudes = new Solicitudes();
	#perfil = new Perfil(this);
	#paso1 = new Paso1(this);
	#rutas = new Rutas(this);
	#paso3 = new Paso3(this);
	#paso5 = new Paso5(this);
	#resumen = new Resumen(this);
	#paso9 = new Paso9(this);
	#isu = new InformeISU(this);

	init() { // init modules
		super.init(this.#solicitudes, valid);
		this.#solicitudes.init();

		this.#perfil.init();
		this.#paso1.init();
		this.#rutas.init();
		this.#paso3.init();
		this.#paso5.init();
		this.#resumen.init();
		this.#paso9.init();
		this.#isu.init();
		return this;
	}

	load(rutas, gastos, dietas, firmas) {
		const id = irse.getId();
		this.#rutas.view(rutas);
		this.#paso5.view(gastos);
		this.#resumen.view(dietas);
		return this.setFirmas(firmas).setValue("idses", id).setCache(id).refresh(irse);
	}
	// IMPORTANT! override super view
	view = (organicas, rutas, gastos, dietas, firmas) => {
		this.#perfil.view(organicas);
		this.load(rutas, gastos, dietas, firmas);//.initInputs();
	}

	getSolicitudes = () => this.#solicitudes; // list
	getPerfil = () => this.#perfil; // module perfil
	getOrganicas = this.#perfil.getOrganicas; // table organicas
	getPaso1 = () => this.#paso1; // module paso1
	getRutas = () => this.#rutas; // module rutas
	getPaso3 = () => this.#paso3; // module paso3
	getPaso5 = () => this.#paso5; // module paso5
	getResumen = () => this.#resumen; // module resumen
	getPaso9 = () => this.#paso9; // module paso5
	getInformeISU = () => this.#isu; // module InformeISU
}

export default new IrseSolicitud();
