
import FormBase from "../../components/forms/FormBase.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import valid from "../i18n/validators.js";

import Organica030 from "../components/inputs/Organica030.js";
import Economica030 from "../components/inputs/Economica030.js";
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
			if (presto.isEditable() || !form.isChanged()) // if editable => back
				return tabs.back().showOk("msgSave030"); // show msg ok
			api.setJSON(partidas.getData()).json("/uae/presto/save/030").then(tabs.showForm);
			form.setChanged();
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
}

customElements.define("organica-030", Organica030, { extends: "input" });
customElements.define("economica-030", Economica030, { extends: "select" });
