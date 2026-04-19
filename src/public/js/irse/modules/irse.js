
import valid from "../i18n/validators/irse.js";
import irse from "../model/Irse.js";
import perfil from "./tabs/perfil.js";
import paso1 from "./tabs/paso1.js";
import rutas from "./tabs/rutas.js";
import paso3 from "./tabs/paso3.js";
import paso5 from "./tabs/paso5.js";
import resumen from "./tabs/resumen.js";
import paso9 from "./tabs/paso9.js";
import informeISU from "./tabs/otri.js";

import IrseSolicitudes from "./solicitudes.js";
import Solicitud from "../../core/modules/solicitud.js";

class IrseSolicitud extends Solicitud {
	init() { // init modules
		super.init(valid);
		perfil.init();
		paso1.init();
		rutas.init();
		paso3.init();
		paso5.init();
		resumen.init();
		paso9.init();
		informeISU.init();
		return this;
	}

	// IMPORTANT! override super view
	view = (interesado, organicas, itinerario, gastos, dietas, cuentas, firmas) => {
		perfil.view(interesado, organicas); // load perfil
		rutas.view(itinerario); // preload rutas (tab 2)
		paso1.view(firmas); // mun require rutas (tab 2)
		paso3.view(); // load isu tab (optional tab)
		paso5.view(gastos); // gastos
		resumen.view(dietas);
		paso9.view(cuentas);
		this.reactivate(irse);
	}

	getSolicitudes = () => window.solicitudes; // tabla de solicitudes
	getPerfil = () => perfil; // module perfil
	getOrganicas = perfil.getOrganicas; // table organicas
	getPaso1 = () => paso1; // module paso1
	getRutas = () => rutas; // module rutas
	getPaso3 = () => paso3; // module paso3
	getPaso5 = () => paso5; // module paso5
	getResumen = () => resumen; // module resumen
	getPaso9 = () => paso9; // module paso5
}

customElements.define("irse-table", IrseSolicitudes, { extends: "table" });

export default new IrseSolicitud();
