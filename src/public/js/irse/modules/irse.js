
import api from "../../core/components/Api.js";
import i18n from "../../core/i18n/langs.js";

import irse from "../model/Irse.js";
import rutas from "../model/Rutas.js";
import gastos from "../model/Gastos.js";

import ButtonFirmar from "../components/buttons/Firmar.js";
import ButtonRechazar from "../components/buttons/Rechazar.js";
import ButtonCancelar from "../components/buttons/Cancelar.js";
import ButtonReport from "../components/buttons/Report.js";
import Urgencia from "../../core/components/layouts/Urgencia.js";
import Solicitud from "../../core/modules/solicitud.js";

import tables from "../components/tables/tables.js";
import tabs from "./tabs.js";

class IrseSolicitud extends Solicitud {
	getSolicitudes = () => tables.getSolicitudes(); // tabla de solicitudes
	getPerfil = () => tabs.getTab("form"); // module perfil paso 0
	getOrganicas = () => this.getPerfil().getOrganicas(); // table organicas
	getPaso1 = () => tabs.getTab(1); // module paso 1
	getRutas = () => tabs.getTab(2); // module rutas paso 2
	getPaso3 = () => tabs.getTab(3); // module paso 3
	getPaso5 = () => tabs.getTab(5); // module paso 5
	getResumen = () => tabs.getTab(6); // module resumen paso 6
	getPaso9 = () => tabs.getTab(9); // module paso 9

	open = data => { // override super arrow function
		// merge server data with list and set in current irse instance
		const row = this.getSolicitudes().getCurrent(); // current row
		irse.setData(row ? Object.assign(row, data.solicitud) : data.solicitud); // merge data

		rutas.setRutas(data.rutas); // registro de rutas
		gastos.setGastos(data.gastos) // registro de gastos
				.setSubv(data.subv).setCongreso(data.congreso) // paso 3
				.setKm(data.km).setAc(data.ac) // pasos 3/4 y resumen
				.setIban(data.iban).setBanco(data.banco); // paso 9

		this.getPerfil().view(data.interesado, data.organicas, data.firmas); // load perfil
		this.getRutas().view(); // load rutas maps (tab 2)
		this.getPaso3().view(); // load isu tab (optional tab)
		this.getPaso5().view(); // load gastos from register
		this.getResumen().view(data.dietas); // tab 6 = resumen
		this.getPaso9().view(data.cuentas); // tab 9 = fin
		tabs.showForm(); // destination tab
	}

	create() {
		api.init().json("/uae/iris/create").then(data => super.create(data));
	}
	clone(row) {
		i18n.confirm("msgReactivar") && api.init().json("/uae/iris/clone?id=" + row.id).then(this.open);
	}
}

customElements.define("btn-firmar", ButtonFirmar, { extends: "button" });
customElements.define("btn-rechazar", ButtonRechazar, { extends: "button" });
customElements.define("btn-cancelar", ButtonCancelar, { extends: "button" });
customElements.define("btn-report", ButtonReport, { extends: "button" });
customElements.define("urgencia-list", Urgencia, { extends: "select" });

export default new IrseSolicitud();
