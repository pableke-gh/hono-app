
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"

import presto from "../model/Presto.js";
import Form from "./form.js";

class Partida030 extends Form {
	#ej030; // is tab preloaded
	#acOrg030 = this.setAutocomplete("#acOrg030");

	constructor() {
		super(); // call super before to use this reference

		const fnSource = term => api.init().json("/uae/presto/organicas/030", { ej: this.getval("#ej030"), term}).then(this.#acOrg030.render);
		const fnSelect = item => this.setValue("#idEco030", item.imp);
		this.#acOrg030.setItemMode(4).setSource(fnSource).setAfterSelect(fnSelect);
	}

	isLoaded = ej => (this.#ej030 == ej); // 030 cargado
	view = partida => { // load tab 030
		const fnLoad = partida => { // load tab 030
			this.#ej030 = partida.ej030 = partida.ej; // Ejercicio de la partida a añadir
			presto.getOrg080 = () => partida.o; // Organica del documento 080
			presto.getDescOrg080 = () => partida.dOrg; // Descripción de la organica del documento 080
			presto.getEco080 = () => partida.e; // Económica del documento 080
			presto.getDescEco080 = () => partida.dEco; // Descripción de la económica del documento 080
			presto.getImp080 = () => partida.imp; // Descripción de la económica del documento 080 
	
			this.setData(partida, ".ui-030").refresh(presto); // Actualizo los campos de la vista
			this.#acOrg030.setValue(partida.idOrg030, partida.o030 + " - " + partida.dOrg030);
			tabs.showTab("030"); // change tab
		}

		if (this.isLoaded(partida.ej))
			return fnLoad(partida);
		// actualizo las economicas de ingresos 030 para el nuevo ejercicio
		const fnEconomicas = economicas => { this.setItems("#idEco030", economicas); fnLoad(partida); }
		api.init().json("/uae/presto/economicas/030?ej=" + partida.ej).then(fnEconomicas);
	}

	autoload = (partida, imp) => {
		if (!partida) // compruebo si existe partida a incrementar
			return !this.showError("Debe seleccionar una partida a incrementar");
		partida.imp = imp; //importe obligatorio
		partida.imp030 = partida.imp; // update imp 030
	}
}

export default new Partida030();
