
import FormBase from "../../components/forms/FormBase.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import valid from "../i18n/validators.js";

import Organica030 from "./inputs/Organica030.js";
import Economica030 from "./inputs/Economica030.js";
import presto from "../model/Presto.js";
import form from "./presto.js";

export default class Partida030 extends FormBase {
	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init() {
		const partidas = form.getPartidas();
		partidas.set("#doc030", this.view);
		tabs.setAction("save030", () => {
			if (!valid.validate030()) // validate partida 080 / 030
				return false; // not valid data
			if (presto.isEditable()) // if editable => back to presto view, send table on tab-action-send
				return tabs.backTab().showOk("Datos del documento 030 asociados correctamente.");
			api.setJSON(partidas.getData()).json("/uae/presto/save/030").then(tabs.showForm);
		});
	}

	view = partida => { // load tab 030
		const eco030 = this.getElement("eco030");
		if (eco030.isLoaded(partida.ej))
			return eco030.showTab(partida); // change tab
		// actualizo las economicas de ingresos 030 para el nuevo ejercicio
		api.init().json("/uae/presto/economicas/030?ej=" + partida.ej).then(economicas => {
			eco030.reload(partida, economicas);
		});
	}

	autoload(partida, imp) {
		if (!partida) // compruebo si existe partida a incrementar
			return !this.showError("Debe seleccionar una partida a incrementar");
		partida.imp = imp || 0; //importe obligatorio
		partida.imp030 = partida.imp; // update imp 030
		return this.setValue("imp", partida.imp); //ok
	}
}

customElements.define("organica-030", Organica030, { extends: "input" });
customElements.define("economica-030", Economica030, { extends: "select" });
