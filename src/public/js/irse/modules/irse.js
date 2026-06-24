
import valid from "../i18n/validators/irse.js";
import perfil from "./tabs/perfil.js";
import paso1 from "./tabs/paso1.js";
import paso2 from "./tabs/rutas.js";
import paso3 from "./tabs/paso3.js";
import paso5 from "./tabs/paso5.js";
import resumen from "./tabs/resumen.js";
import paso9 from "./tabs/paso9.js";
import informeISU from "./tabs/otri.js";

import Urgencia from "../../core/components/layouts/Urgencia.js";
import Firmas from "../../core/components/layouts/Firmas.js";
import IrseSolicitudes from "./solicitudes.js";
import Solicitud from "../../core/modules/solicitud.js";

class IrseSolicitud extends Solicitud {
	init() { // init modules
		super.init(valid);
		perfil.init();
		paso1.init();
		paso2.init();
		paso3.init();
		paso5.init();
		resumen.init();
		paso9.init();
		informeISU.init();
		return this;
	}

	// IMPORTANT! override super view
	view = (interesado, organicas, dietas, cuentas, firmas) => {
		perfil.view(interesado, organicas, firmas); // load perfil
		paso2.view(); // preload maps rutas (tab 2)
		paso1.view(); // mun require rutas preloaded
		paso3.view(); // load isu tab (optional tab)
		paso5.view(); // load gastos from register
		resumen.view(dietas); // tab 6 = resumen
		paso9.view(cuentas); // tab 9 = fin
	}

	getSolicitudes = () => window.solicitudes; // tabla de solicitudes
	getPerfil = () => perfil; // module perfil paso 0
	getOrganicas = perfil.getOrganicas; // table organicas
	getPaso1 = () => paso1; // module paso 1
	getRutas = () => paso2; // module rutas paso 2
	getPaso3 = () => paso3; // module paso 3
	getPaso5 = () => paso5; // module paso 5
	getResumen = () => resumen; // module resumen paso 6
	getPaso9 = () => paso9; // module paso 9
}

customElements.define("urgencia-list", Urgencia, { extends: "select" });
customElements.define("firmas-block", Firmas, { extends: "div" });
customElements.define("irse-table", IrseSolicitudes, { extends: "table" });

export default new IrseSolicitud();
