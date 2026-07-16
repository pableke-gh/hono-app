
import valid from "../i18n/validators/irse.js";
import perfil from "./perfil.js";
import paso1 from "./paso1.js";
import paso2 from "./rutas.js";
import paso3 from "./paso3.js";
import paso5 from "./paso5.js";
import resumen from "./resumen.js";
import paso9 from "./paso9.js";
import informeISU from "./otri.js";

import Urgencia from "../../core/components/layouts/Urgencia.js";
import Firmas from "../../core/components/layouts/Firmas.js";
import Solicitud from "../../core/modules/solicitud.js";
import tables from "../components/tables/tables.js";

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

	getSolicitudes = () => tables.get("solicitudes"); // tabla de solicitudes
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

export default new IrseSolicitud();
